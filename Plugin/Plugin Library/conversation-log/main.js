'use strict';
const fs = require('fs');
const path = require('path');

let DIR = null;
let seq = 0;

function append(entry) {
  const day = new Date().toISOString().slice(0, 10);
  const file = path.join(DIR, day + '.jsonl');
  fs.appendFileSync(file, JSON.stringify(entry) + '\n', 'utf8');
  return file;
}

module.exports = {
  init(ctx) {
    DIR = path.join(ctx.dir, 'logs');
    fs.mkdirSync(DIR, { recursive: true });
    ctx.log('日志目录:', DIR);
  },

  onRequest(ctx) {
    if (ctx.path.indexOf('/chat/completions') < 0) return;
    const j = ctx.json;
    if (!j || !Array.isArray(j.messages)) return;

    const id = 'r' + Date.now().toString(36) + '-' + (++seq);
    ctx.__logId = id;
    ctx.__logTime = Date.now();
    append({
      id,
      type: 'request',
      time: new Date().toISOString(),
      model: j.model || '',
      stream: !!j.stream,
      messages: j.messages.slice(-8)
    });
  },

  onResponseJson(ctx, json) {
    if (!ctx.__logId) return;
    const msg = json && json.choices && json.choices[0] && json.choices[0].message;
    if (!msg) return;
    append({
      id: ctx.__logId,
      type: 'reply',
      time: new Date().toISOString(),
      ms: Date.now() - ctx.__logTime,
      content: msg.content
    });
  },

  routes: {
    '/stats': () => {
      if (!DIR) return { ok: false };
      const files = fs.readdirSync(DIR).filter(f => f.endsWith('.jsonl'));
      let lines = 0;
      for (const f of files) {
        lines += fs.readFileSync(path.join(DIR, f), 'utf8').split('\n').filter(Boolean).length;
      }
      return { dir: DIR, files: files.sort(), lines };
    },
    '/tail': (req) => {
      if (!DIR) return { ok: false };
      const n = Math.max(1, Math.min(200, Number(req.query.n) || 20));
      const files = fs.readdirSync(DIR).filter(f => f.endsWith('.jsonl')).sort();
      if (!files.length) return { lines: [] };
      const all = fs.readFileSync(path.join(DIR, files[files.length - 1]), 'utf8')
        .split('\n').filter(Boolean);
      return { file: files[files.length - 1], lines: all.slice(-n).map(l => JSON.parse(l)) };
    }
  }
};
