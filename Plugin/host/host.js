'use strict';
/**
 * llama.cpp Plugin Host
 * ---------------------------------------------------------------
 * 不改动 llama.cpp 任何文件：
 *   1. 由本程序启动 llama-server.exe（内部端口 8081）
 *   2. 对外监听 8080，做反向代理，插件挂在这条链路上
 *   3. 插件放在 Plugin/<名字>/ 下，每个目录一个 plugin.json + main.js
 *
 * 插件钩子：
 *   init(ctx)                 加载时调用一次
 *   serverArgs(args)          返回新的启动参数数组
 *   serverEnv(env)            返回要追加的环境变量
 *   onRequest(ctx)            改请求：ctx.path / ctx.headers / ctx.json
 *                             拦请求：ctx.block = true
 *   onResponseJson(ctx, json) 改非流式 JSON 回复
 *   onSSEText(text, meta)     改流式回复里的每一段文本，返回新字符串
 *   onHtml(html)              改 Web UI 的 HTML，返回新 HTML
 *   routes: { '/x': fn }      暴露接口 → /__plugins/api/<id>/x
 *   webui: { js, css }        注入到 Web UI 的前端资源
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { TextDecoder } = require('util');
const zlib = require('zlib');

const HOST_DIR = __dirname;
const PLUGIN_ROOT = path.resolve(HOST_DIR, '..');
// 插件库：所有装进来的插件都住在这里，和宿主本身分开
const LIBRARY_DIR = path.join(PLUGIN_ROOT, 'Plugin Library');
const LLAMA_ROOT = path.resolve(PLUGIN_ROOT, '..');
const CFG_PATH = path.join(HOST_DIR, 'host.json');

const DEFAULT_CFG = {
  listen: { host: '127.0.0.1', port: 8080 },
  server: { exe: 'llama-server.exe', host: '127.0.0.1', port: 8081, autoStart: true },
  model: 'models/MiniCPM5-1B-F16.gguf',
  context: 32768,
  ngl: 999,
  extraArgs: ['--flash-attn', 'auto', '--temp', '0.6', '--top-p', '0.95', '--min-p', '0.05', '--repeat-penalty', '1.05'],
  openBrowser: true,
  debug: false,
  chromeMode: '--new-window',
  plugins: { disabled: [] }
};

function log(...a) {
  const t = new Date().toTimeString().slice(0, 8);
  console.log('[' + t + ']', ...a);
}

let CFG = loadCfg();

/* ------------------------------------------------- 命令行覆盖（启动脚本用）
 *   node host.js --model models/X.gguf --think 1
 *   --think 1 开思考 / 0 关思考 / 不传 = 沿用 host.json 的 extraArgs
 *   --dry-run 只打印将要传给 llama-server 的参数然后退出
 */
const ARGV = process.argv.slice(2);
function argVal(name) {
  const i = ARGV.indexOf(name);
  return i >= 0 ? ARGV[i + 1] : null;
}
const REASONING_FLAGS = ['--reasoning', '-rea', '--reasoning-budget', '--reasoning-effort', '--reasoning-format', '--reasoning-budget-message'];
function stripReasoningArgs(list) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const a = String(list[i]);
    if (REASONING_FLAGS.indexOf(a) >= 0) { i++; continue; }
    if (a.indexOf('--reasoning=') === 0 || a.indexOf('-rea=') === 0) continue;
    out.push(a);
  }
  return out;
}
let THINK_MODE = null;
const _modelArg = argVal('--model');
if (_modelArg) CFG.model = String(_modelArg).split(String.fromCharCode(92)).join('/');
const _thinkArg = argVal('--think');
if (_thinkArg === '1') THINK_MODE = true;
else if (_thinkArg === '0') THINK_MODE = false;


function loadCfg() {
  try {
    const raw = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
    return Object.assign(structuredClone(DEFAULT_CFG), raw, { plugins: Object.assign({ disabled: [] }, raw.plugins || {}) });
  } catch (e) {
    log('host.json 读取失败，使用默认配置:', e.message);
    return structuredClone(DEFAULT_CFG);
  }
}
function saveCfg() {
  const tmp = CFG_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(CFG, null, 2), 'utf8');
  fs.renameSync(tmp, CFG_PATH);
}

const state = { plugins: [], proc: null, ready: false, crashed: false };

/* ------------------------------------------------------------- plugins */

function loadPlugins() {
  const list = [];
  let ents = [];
  try {
    fs.mkdirSync(LIBRARY_DIR, { recursive: true });
    ents = fs.readdirSync(LIBRARY_DIR, { withFileTypes: true });
  } catch (e) { log('插件库不可用:', e.message); }
  ents = ents.filter(e => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));

  for (const ent of ents) {
    const dir = path.join(LIBRARY_DIR, ent.name);
    const mf = path.join(dir, 'plugin.json');
    if (!fs.existsSync(mf)) continue;

    let meta = {};
    try { meta = JSON.parse(fs.readFileSync(mf, 'utf8')); }
    catch (e) {
      list.push({ id: ent.name, dir, meta: {}, enabled: false, error: 'plugin.json 不是合法 JSON: ' + e.message, mod: null });
      continue;
    }

    const id = meta.id || ent.name;
    const disabled = (CFG.plugins.disabled || []).includes(id) || meta.enabled === false;
    const rec = { id, dir, meta, enabled: !disabled, error: null, mod: null };

    if (rec.enabled) {
      try {
        const entry = path.join(dir, meta.main || 'main.js');
        delete require.cache[require.resolve(entry)];
        rec.mod = require(entry) || {};
        if (typeof rec.mod.init === 'function') {
          rec.mod.init({
            config: CFG, plugin: rec, dir, llamaRoot: LLAMA_ROOT, hostDir: HOST_DIR,
            log: (...a) => log('[' + id + ']', ...a)
          });
        }
      } catch (e) {
        rec.enabled = false;
        rec.error = '加载失败: ' + e.message;
        log('插件 ' + id + ' 加载失败:', e.message);
      }
    }
    list.push(rec);
  }
  state.plugins = list;
  log('插件扫描完成：' + list.filter(p => p.enabled).length + ' 个启用 / ' + list.length + ' 个已安装');
  return list;
}

const active = () => state.plugins.filter(p => p.enabled && p.mod);

function pluginServerArgs(args) {
  let out = args;
  for (const p of active()) {
    if (typeof p.mod.serverArgs !== 'function') continue;
    try { const r = p.mod.serverArgs(out.slice()); if (Array.isArray(r)) out = r; }
    catch (e) { log('[' + p.id + '] serverArgs 出错:', e.message); }
  }
  return out;
}

async function pluginOnRequest(ctx) {
  for (const p of active()) {
    if (typeof p.mod.onRequest !== 'function') continue;
    try { await p.mod.onRequest(ctx); }
    catch (e) { log('[' + p.id + '] onRequest 出错:', e.message); }
  }
}

function pluginOnHtml(html) {
  let out = html;
  for (const p of active()) {
    if (typeof p.mod.onHtml !== 'function') continue;
    try { const r = p.mod.onHtml(out); if (typeof r === 'string') out = r; }
    catch (e) { log('[' + p.id + '] onHtml 出错:', e.message); }
  }
  return out;
}

function pluginOnJson(json, ctx) {
  for (const p of active()) {
    if (typeof p.mod.onResponseJson !== 'function') continue;
    try { p.mod.onResponseJson(ctx, json); }
    catch (e) { log('[' + p.id + '] onResponseJson 出错:', e.message); }
  }
}

function pluginOnSseText(text, meta) {
  let out = text;
  for (const p of active()) {
    if (typeof p.mod.onSSEText !== 'function') continue;
    try { const r = p.mod.onSSEText(out, meta); if (typeof r === 'string') out = r; }
    catch (e) { log('[' + p.id + '] onSSEText 出错:', e.message); }
  }
  return out;
}

/* -------------------------------------------------------------- server */

function buildArgs() {
  const s = CFG.server;
  const base = [
    '--model', path.join(LLAMA_ROOT, CFG.model),
    '--ctx-size', String(CFG.context),
    '--n-gpu-layers', String(CFG.ngl),
    '--host', s.host,
    '--port', String(s.port)
  ];
  /* 先摘掉 extraArgs 里已有的 --reasoning* 参数，再按本次选择追加 */
  let extra = stripReasoningArgs(CFG.extraArgs || []);
  if (THINK_MODE === true) extra = extra.concat(['--reasoning', 'on']);
  if (THINK_MODE === false) extra = extra.concat(['--reasoning', 'off', '--reasoning-budget', '0']);
  const args = base.concat(extra);
  return pluginServerArgs(args);
}

function startServer() {
  if (state.proc) return;
  const exe = path.join(LLAMA_ROOT, CFG.server.exe);
  if (!fs.existsSync(exe)) {
    log('找不到 llama-server.exe:', exe);
    state.crashed = true;
    return;
  }
  const args = buildArgs();
  log('模型：' + CFG.model + ' ｜ 思考：' + (THINK_MODE === null ? '无覆盖' : (THINK_MODE ? '开' : '关')));
  log('启动 llama-server：', exe);
  log('参数：', args.join(' '));

  const env = Object.assign({}, process.env);
  for (const p of active()) {
    if (typeof p.mod.serverEnv !== 'function') continue;
    try { Object.assign(env, p.mod.serverEnv(Object.assign({}, env)) || {}); } catch (e) { }
  }

  const proc = spawn(exe, args, { cwd: LLAMA_ROOT, env, windowsHide: true });
  state.proc = proc;
  proc.stdout.on('data', d => process.stdout.write('[llama] ' + d));
  proc.stderr.on('data', d => process.stderr.write('[llama] ' + d));
  proc.on('exit', code => {
    log('llama-server 已退出，code =', code);
    state.proc = null;
    state.ready = false;
    state.crashed = true;
  });
  waitReady();
}

function probe() {
  return new Promise(resolve => {
    const req = http.get(
      { host: CFG.server.host, port: CFG.server.port, path: '/health', timeout: 1500 },
      r => { r.resume(); resolve(r.statusCode === 200); }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function waitReady() {
  const deadline = Date.now() + 180000;
  while (Date.now() < deadline) {
    if (await probe()) {
      state.ready = true;
      log('服务器就绪 →', publicUrl());
      openBrowser();
      return;
    }
    if (state.crashed) return;
    await new Promise(r => setTimeout(r, 400));
  }
  log('等待服务器就绪超时');
}

/* ------------------------------------------------------------- browser */

function findChrome() {
  const B = String.fromCharCode(92);
  const roots = [
    process.env.ProgramFiles || ('C:' + B + 'Program Files'),
    process.env['ProgramFiles(x86)'] || ('C:' + B + 'Program Files (x86)'),
    process.env.LOCALAPPDATA || ''
  ];
  for (const root of roots) {
    if (!root) continue;
    const p = path.join(root, 'Google', 'Chrome', 'Application', 'chrome.exe');
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const publicUrl = () => 'http://' + CFG.listen.host + ':' + CFG.listen.port;

function openBrowser() {
  if (!CFG.openBrowser) return;
  const url = publicUrl();
  const chrome = findChrome();
  try {
    if (chrome) {
      spawn(chrome, [CFG.chromeMode || '--new-window', url], { detached: true, stdio: 'ignore' }).unref();
      log('已在 Chrome 中打开：', url);
    } else {
      spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
      log('未找到 Chrome，用默认浏览器打开：', url);
    }
  } catch (e) { log('打开浏览器失败:', e.message); }
}

/* ------------------------------------------------------------- helpers */

function readBody(req) {
  return new Promise((resolve, reject) => {
    const c = [];
    req.on('data', d => c.push(d));
    req.on('end', () => resolve(Buffer.concat(c)));
    req.on('error', reject);
  });
}

function sendJson(res, code, obj) {
  const b = Buffer.from(JSON.stringify(obj), 'utf8');
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'content-length': b.length });
  res.end(b);
}
function sendHtml(res, html, code) {
  const b = Buffer.from(html, 'utf8');
  res.writeHead(code || 200, { 'content-type': 'text/html; charset=utf-8', 'content-length': b.length, 'cache-control': 'no-store' });
  res.end(b);
}
function sendJs(res, js) {
  const b = Buffer.from(js, 'utf8');
  res.writeHead(200, { 'content-type': 'application/javascript; charset=utf-8', 'content-length': b.length, 'cache-control': 'no-store' });
  res.end(b);
}

/* --------------------------------------------------------------- proxy */

const LOADING_HTML = '<!doctype html><meta charset="utf-8">' +
  '<title>llama.cpp 正在加载模型</title>' +
  '<style>body{background:#111;color:#ddd;font:16px/1.7 system-ui;display:grid;place-items:center;height:100vh;margin:0}' +
  'small{color:#666}</style>' +
  '<div style="text-align:center"><div>模型加载中…</div><small>本页每 2 秒自动刷新</small></div>' +
  '<script>setTimeout(function(){location.reload()},2000)</script>';

function transformSseEvent(ev) {
  if (ev.indexOf('data:') !== 0) return ev;
  const payload = ev.slice(5).trim();
  if (!payload || payload === '[DONE]') return ev;
  let j;
  try { j = JSON.parse(payload); } catch (e) { return ev; }
  let changed = false;
  for (const ch of j.choices || []) {
    const d = ch.delta;
    if (d && typeof d.content === 'string') {
      const t = pluginOnSseText(d.content, { chunk: j });
      if (t !== d.content) { d.content = t; changed = true; }
    }
  }
  return changed ? 'data: ' + JSON.stringify(j) : ev;
}

function injectRuntime(html) {
  const tags = [];
  for (const p of active()) {
    const w = p.mod.webui;
    if (w && w.css) tags.push('<link rel="stylesheet" href="/__plugins/' + p.id + '/' + w.css + '">');
  }
  tags.push('<script src="/__plugins/runtime.js"></script>');
  for (const p of active()) {
    const w = p.mod.webui;
    if (w && w.js) tags.push('<script src="/__plugins/' + p.id + '/' + w.js + '"></script>');
  }
  const block = '\n' + tags.join('\n') + '\n';
  if (html.indexOf('</body>') >= 0) return html.replace('</body>', block + '</body>');
  if (html.indexOf('</head>') >= 0) return html.replace('</head>', block + '</head>');
  return html + block;
}

function proxy(req, res, ctx, outBody) {
  const opts = {
    host: CFG.server.host,
    port: CFG.server.port,
    method: ctx.method,
    path: ctx.path,
    headers: Object.assign({}, ctx.headers, { host: CFG.server.host + ':' + CFG.server.port })
  };
  delete opts.headers['content-length'];
  delete opts.headers['if-none-match'];
  delete opts.headers['if-modified-since'];
  opts.headers['accept-encoding'] = 'gzip';
  if (outBody && outBody.length) opts.headers['content-length'] = String(outBody.length);

  const up = http.request(opts, upRes => {
    const ct = String(upRes.headers['content-type'] || '');
    const isSse = ct.indexOf('text/event-stream') >= 0;
    const isHtml = ct.indexOf('text/html') >= 0;
    const isJson = ct.indexOf('application/json') >= 0;

    if (!isSse && !isHtml && !isJson) {
      res.writeHead(upRes.statusCode || 502, upRes.headers);
      return upRes.pipe(res);
    }

    const headers = Object.assign({}, upRes.headers);
    delete headers['content-length'];
    const chunks = [];

    if (isSse) {
      res.writeHead(upRes.statusCode || 200, headers);
      const dec = new TextDecoder('utf-8');
      let buf = '';
      upRes.on('data', chunk => {
        buf += dec.decode(chunk, { stream: true });
        let i;
        while ((i = buf.indexOf('\n\n')) >= 0) {
          const ev = buf.slice(0, i);
          buf = buf.slice(i + 2);
          const out = transformSseEvent(ev);
          res.write(out + '\n\n');
        }
      });
      upRes.on('end', () => { if (buf) res.write(buf); res.end(); });
      return;
    }

    upRes.on('data', c => chunks.push(c));
    upRes.on('end', () => {
      let rawBuf = Buffer.concat(chunks);
      if (String(upRes.headers['content-encoding'] || '').indexOf('gzip') >= 0) {
        try { rawBuf = zlib.gunzipSync(rawBuf); delete headers['content-encoding']; } catch (e) { }
      }
      let body = rawBuf.toString('utf8');
      if (isHtml) {
        body = pluginOnHtml(injectRuntime(body));
      } else if (isJson) {
        try {
          const j = JSON.parse(body);
          pluginOnJson(j, ctx);
          body = JSON.stringify(j);
        } catch (e) { }
      }
      delete headers['etag'];
      delete headers['last-modified'];
      if (isHtml) headers['cache-control'] = 'no-store, must-revalidate';
      const b = Buffer.from(body, 'utf8');
      headers['content-length'] = String(b.length);
      res.writeHead(upRes.statusCode || 200, headers);
      res.end(b);
    });
  });

  up.on('error', e => {
    log('上游请求失败:', e.message);
    if (!res.headersSent) sendJson(res, 502, { error: 'llama.cpp 服务器无响应: ' + e.message });
  });
  if (outBody && outBody.length) up.write(outBody);
  up.end();
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;

  if (p.indexOf('/__plugins/') === 0) return adminRoute(req, res, url);

  if (!state.ready && p.indexOf('/v1/') !== 0 && p !== '/health' && p !== '/props') {
    if (p === '/' || p === '/index.html') return sendHtml(res, LOADING_HTML);
  }

  const raw = await readBody(req);
  const ctx = {
    method: req.method,
    path: req.url,
    headers: Object.assign({}, req.headers),
    rawBody: raw,
    json: null,
    block: false
  };
  const ct = String(req.headers['content-type'] || '');
  if (ct.indexOf('application/json') >= 0 && raw.length) {
    try { ctx.json = JSON.parse(raw.toString('utf8')); } catch (e) { }
  }
  await pluginOnRequest(ctx);

  if (CFG.debug && ctx.json) {
    try {
      fs.writeFileSync(path.join(HOST_DIR, "last-request.json"), JSON.stringify({ path: ctx.path, json: ctx.json }, null, 2), "utf8");
    } catch (e) { }
  }

  if (ctx.block) return sendJson(res, 403, { error: ctx.blockReason || '此请求被插件拦截' });

  let outBody = raw;
  if (ctx.json) outBody = Buffer.from(JSON.stringify(ctx.json), 'utf8');
  proxy(req, res, ctx, outBody);
}

/* --------------------------------------------------------------- admin */

function pluginList() {
  return {
    ok: true,
    server: { ready: state.ready, up: CFG.server.host + ':' + CFG.server.port, url: publicUrl(), library: LIBRARY_DIR },
    plugins: state.plugins.map(p => ({
      id: p.id,
      name: p.meta.name || p.id,
      version: p.meta.version || '',
      description: p.meta.description || '',
      author: p.meta.author || '',
      enabled: p.enabled,
      error: p.error,
      hooks: p.mod ? Object.keys(p.mod) : []
    }))
  };
}

function runtimeJs() {
  const items = active().map(p => ({ id: p.id, name: p.meta.name || p.id }));
  return '/* llama.cpp plugin runtime */\n' +
    'window.__LLAMA_PLUGINS__ = ' + JSON.stringify(items) + ';\n' +
    'window.llamaPluginFetch = function (id, p, opts) {\n' +
    '  return fetch("/__plugins/api/" + id + p, opts).then(function (r) { return r.json(); });\n' +
    '};\n' +
    'document.dispatchEvent(new CustomEvent("llama-plugins-ready", { detail: window.__LLAMA_PLUGINS__ }));\n';
}

const MIME = {
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

async function adminRoute(req, res, url) {
  const seg = url.pathname.split('/').filter(Boolean);
  const rest = seg.slice(1);
  const head = rest[0] || '';

  if (head === 'admin') return sendHtml(res, ADMIN_HTML);
  if (head === 'list') return sendJson(res, 200, pluginList());
  if (head === 'runtime.js') return sendJs(res, runtimeJs());

  if (head === 'reload') {
    loadPlugins();
    return sendJson(res, 200, pluginList());
  }

  if (head === 'toggle' && req.method === 'POST') {
    let body = {};
    try { body = JSON.parse((await readBody(req)).toString('utf8') || '{}'); } catch (e) { }
    if (!body.id) return sendJson(res, 400, { error: '缺少 id' });
    const set = new Set(CFG.plugins.disabled || []);
    if (body.enabled) set.delete(body.id); else set.add(body.id);
    CFG.plugins.disabled = Array.from(set);
    saveCfg();
    loadPlugins();
    return sendJson(res, 200, pluginList());
  }

  if (head === 'api') {
    const id = rest[1];
    const sub = '/' + rest.slice(2).join('/');
    const pl = state.plugins.find(p => p.id === id && p.enabled && p.mod);
    const fn = pl && pl.mod.routes && pl.mod.routes[sub];
    if (typeof fn !== 'function') return sendJson(res, 404, { error: '没有这个插件接口: ' + id + sub });
    const raw = await readBody(req);
    let json = null;
    try { json = JSON.parse(raw.toString('utf8')); } catch (e) { }
    try {
      const r = await fn({ method: req.method, query: Object.fromEntries(url.searchParams), raw, json, config: CFG });
      return sendJson(res, 200, r === undefined ? { ok: true } : r);
    } catch (e) {
      return sendJson(res, 500, { error: e.message });
    }
  }

  const id = head;
  const rel = rest.slice(1).join('/');
  const pl = state.plugins.find(p => p.id === id);
  if (!pl || !rel) return sendJson(res, 404, { error: '未找到插件资源' });
  const full = path.resolve(pl.dir, rel);
  if (full.indexOf(pl.dir + path.sep) !== 0 || !fs.existsSync(full) || !fs.statSync(full).isFile()) {
    return sendJson(res, 404, { error: '未找到插件资源' });
  }
  const b = fs.readFileSync(full);
  res.writeHead(200, {
    'content-type': MIME[path.extname(full).toLowerCase()] || 'application/octet-stream',
    'content-length': b.length,
    'cache-control': 'no-store'
  });
  res.end(b);
}

/* ---------------------------------------------------------- admin page */

const ADMIN_HTML = `<!doctype html><meta charset="utf-8"><title>llama.cpp 插件管理</title>
<style>
:root{color-scheme:dark}
body{margin:0;background:#0f1115;color:#e6e6e6;font:15px/1.6 system-ui,"Segoe UI",sans-serif}
header{padding:20px 28px;border-bottom:1px solid #23262d;display:flex;align-items:baseline;gap:14px}
h1{font-size:19px;margin:0;font-weight:600}
.meta{color:#7f8794;font-size:13px}
main{padding:20px 28px;max-width:900px}
.card{border:1px solid #23262d;border-radius:10px;padding:16px 18px;margin-bottom:12px;background:#15181d}
.card.on{border-color:#2f6b46}
.row{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
.name{font-weight:600}
.ver{color:#7f8794;font-size:12px;margin-left:8px}
.desc{color:#9aa3af;margin-top:6px;font-size:13px}
.hooks{margin-top:8px;display:flex;gap:6px;flex-wrap:wrap}
.tag{background:#1e2229;border:1px solid #2a2f38;border-radius:5px;padding:1px 7px;font-size:12px;color:#8b94a1}
.sw{position:relative;width:44px;height:24px;flex:0 0 auto}
.sw input{opacity:0;width:100%;height:100%;margin:0;cursor:pointer}
.sw span{position:absolute;inset:0;background:#333842;border-radius:99px;transition:.15s;pointer-events:none}
.sw span:after{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.15s}
.sw input:checked+span{background:#2f8f5b}
.sw input:checked+span:after{transform:translateX(20px)}
button{background:#1e2229;color:#dfe3e8;border:1px solid #2f3540;border-radius:7px;padding:7px 14px;cursor:pointer;font:inherit}
button:hover{background:#252a33}
.err{color:#ff8b8b;font-size:13px;margin-top:8px}
.bar{display:flex;gap:10px;align-items:center;margin-bottom:16px}
</style>
<header><h1>llama.cpp 插件</h1><span class="meta" id="srv">…</span></header>
<main>
  <div class="bar">
    <button onclick="reload()">重新扫描</button>
    <button onclick="location.href='/'">打开聊天界面</button>
  </div>
  <div id="list"></div>
</main>
<script>
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
async function load(){
  const r = await fetch('/__plugins/list').then(function(x){return x.json()});
  document.getElementById('srv').textContent =
    (r.server.ready ? '服务器就绪' : '服务器未就绪') + ' · ' + r.server.url + ' · 插件库: ' + r.server.library;
  const box = document.getElementById('list');
  if(!r.plugins.length){
    box.innerHTML = '<div class="card">插件库还是空的。把插件文件夹放进 <code>' + r.server.library + '</code>，点「重新扫描」。</div>';
    return;
  }
  box.innerHTML = r.plugins.map(function(p){
    const hooks = (p.hooks||[]).filter(function(h){return h!=='init'}).map(function(h){return '<span class="tag">'+esc(h)+'</span>'}).join('');
    return '<div class="card '+(p.enabled?'on':'')+'">'+
      '<div class="row"><div>'+
      '<div class="name">'+esc(p.name)+'<span class="ver">'+esc(p.version)+(p.author?' · '+esc(p.author):'')+'</span></div>'+
      '<div class="desc">'+esc(p.description)+'</div>'+
      '<div class="hooks">'+hooks+'</div>'+
      (p.error?'<div class="err">'+esc(p.error)+'</div>':'')+
      '</div><label class="sw"><input type="checkbox" '+(p.enabled?'checked':'')+
      ' onchange="toggle(\''+esc(p.id)+'\',this.checked)"><span></span></label></div></div>';
  }).join('');
}
async function toggle(id,enabled){
  await fetch('/__plugins/toggle',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:id,enabled:enabled})});
  load();
}
async function reload(){ await fetch('/__plugins/reload'); load(); }
load();
</script>`;

/* ---------------------------------------------------------------- main */

loadPlugins();
if (ARGV.indexOf('--dry-run') >= 0) {
  log('dry-run，不启动服务器');
  log('模型：' + CFG.model + ' ｜ 思考：' + (THINK_MODE === null ? '无覆盖' : (THINK_MODE ? '开' : '关')));
  log('参数：' + buildArgs().join(' '));
  process.exit(0);
}
if (CFG.server.autoStart) startServer();

const server = http.createServer((req, res) => {
  handle(req, res).catch(e => {
    log('请求处理异常:', e.message);
    if (!res.headersSent) sendJson(res, 500, { error: e.message });
    else { try { res.end(); } catch (x) { } }
  });
});

server.listen(CFG.listen.port, CFG.listen.host, () => {
  log('插件宿主已启动：' + publicUrl());
  log('插件管理页：' + publicUrl() + '/__plugins/admin');
});

function shutdown() {
  log('正在关闭…');
  if (state.proc) { try { state.proc.kill(); } catch (e) { } }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1500);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', () => { if (state.proc) { try { state.proc.kill(); } catch (e) { } } });
