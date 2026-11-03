# llama.cpp 插件系统（Plugin）

不修改 llama.cpp 的任何文件。宿主和插件库分开住：

```
D:\GAME\llama cpp\
├── llama-server.exe           ← 原版，没动过
├── models\                    ← 原版
└── Plugin\                    ← 插件宿主（本程序本体）
    ├── host\
    │   ├── host.js            启动器 + 反向代理 + 插件加载器
    │   └── host.json          配置：模型、端口、参数
    ├── Plugin Library\        ← 插件库：所有装进来的插件都在这儿
    │   ├── system-prompt\
    │   ├── conversation-log\
    │   └── webui-badge\
    ├── 启动-带插件.bat
    ├── 安装插件.bat
    └── README.md
```

**宿主 = `Plugin\`，插件 = `Plugin\Plugin Library\`。** 卸载插件只动库里的文件夹，宿主不受影响。

## 怎么跑

双击 `Plugin\启动-带插件.bat`。

0. 先选模型（列表带体积），再选 Think / No Think，和 `启动.bat` 一样
1. 从 `..\llama-server.exe` 启动服务器（内部端口 **8081**）
2. 在 **8080** 起反向代理，Chrome 打开的是 8080
3. 模型加载完自动开 Chrome

> **8080 是带插件的入口，8081 是裸的 llama.cpp。**
> 管理页：<http://127.0.0.1:8080/__plugins/admin>
> 老的 `启动.bat` 也占 8080，两个别同时开。

菜单选完，脚本实际执行的是（等价于手动敲）：

```bat
node host.js --model "models\MiniCPM5-1B-F16.gguf" --think 0
```

| 参数 | 作用 |
| --- | --- |
| `--model <路径>` | 覆盖 `host.json` 里的 `model`，相对 llama.cpp 根目录 |
| `--think 1` | 追加 `--reasoning on` |
| `--think 0` | 追加 `--reasoning off --reasoning-budget 0`，真的关掉思考 |
| 不传 `--think` | 沿用 `host.json` 的 `extraArgs` |
| `--dry-run` | 只打印最终传给 `llama-server` 的参数，然后退出 |

选择只在本次启动有效，不写回 `host.json`。想固定默认值就改 `host.json`。

## 插件长什么样

`Plugin\Plugin Library\<插件名>\` 下至少两个文件：

```
my-plugin\
├── plugin.json    元数据
└── main.js        钩子
```

`plugin.json`：

```json
{
  "id": "my-plugin",
  "name": "我的插件",
  "version": "1.0.0",
  "description": "一句话说明",
  "main": "main.js",
  "enabled": true,
  "options": { "任意配置": "插件自己读" },
  "webui": { "js": "webui.js", "css": "style.css" }
}
```

`main.js` 导出任意钩子：

| 钩子 | 干什么 |
|---|---|
| `init(ctx)` | 加载时调一次，`ctx.plugin.meta.options` 是配置 |
| `serverArgs(args)` | 返回新的启动参数数组（能改模型、上下文、采样参数） |
| `serverEnv(env)` | 返回要追加的环境变量 |
| `onRequest(ctx)` | 改请求。`ctx.json` 可改；`ctx.path`/`ctx.headers` 可改；`ctx.block = true` 拦截 |
| `onResponseJson(ctx, json)` | 改非流式回复 |
| `onSSEText(text, meta)` | 改流式回复中的每一段文本，**返回新字符串** |
| `onHtml(html)` | 改 Web UI 的 HTML，**返回新 HTML** |
| `routes: { '/x': fn }` | 暴露接口 → `POST /__plugins/api/<id>/x` |
| `webui: {js, css}` | 前端资源，自动注入聊天界面 |

最小示例：

```js
module.exports = {
  onRequest(ctx) {
    if (ctx.json && ctx.json.messages) {
      ctx.json.messages.unshift({ role: 'system', content: '回答请用日语。' });
    }
  }
};
```

## 装插件

三种都行，装完都落在 `Plugin\Plugin Library\`：

- 直接把插件文件夹拖进 `Plugin Library\`
- 把文件夹或 zip 拖到 `安装插件.bat` 上
- `安装插件.bat "D:\path\to\my-plugin"`

然后在管理页点「重新扫描」，或访问 `http://127.0.0.1:8080/__plugins/reload`。

启用/禁用会写进 `host.json` 的 `plugins.disabled`，重启记得住。

## 自带三个示例

- **system-prompt** — 每次对话自动加 system prompt；`options.mode = "prepend"`（只在没有时补）或 `"replace"`（顶掉模型自带的）
- **conversation-log** — 请求/回复写进 `logs/日期.jsonl`，`/__plugins/api/conversation-log/stats` 看统计
- **webui-badge** — 聊天界面右下角加角标，点击进管理页


### UI language 附带的语言切换

页面右上角有个「🌐 中文」按钮，点开可选 中文 / 日本語 / English：

- 选 **English** 不是「停止翻译」，而是把每个被改过的节点**还原成原始英文**（插件会存原文），所以切回去和原版完全一致
- 选择记在 `localStorage["llamacpp.ui.lang"]`，刷新后保持
- 控制台里也可以直接调：`__zhCN.setLang("en")` / `__zhCN.setLang("zh")`

### UI language（`Plugin Library/ui-language`）

把 llama.cpp Web UI 翻成中文或日文（各 555 条，键一一对应），只做整串精确匹配，不碰对话内容与代码块。日文缺词直接回落英文，不会串成中文。
加词条改 `translate.js` 里的 `DICT` / `EXTRA` / `EXTRA2`，刷新即生效。


### 强制刷新（hard-reload）

界面右上角、语言按钮左边有个「⟳ 刷新」按钮，等价于 Ctrl+Shift+R：

1. 清空 `CacheStorage`（Service Worker / 资源缓存都在这）
2. 注销 Service Worker（避免旧壳子继续拦截）
3. 用带时间戳的地址 `location.replace` 重新加载，绕开文档缓存
4. 新页面加载后把时间戳参数去掉，地址栏保持干净

控制台也能触发：`__hardReload()`。界面切到英文时按钮自动变成「Reload」。

### 人格库（system-prompt v2）

右侧上方「🎭 小鲸 ▾」按钮，点开可以切换人格。

```
Plugin Library\system-prompt\
├── main.js            编译人格卡 → system prompt，注入每次请求
├── panel.js           右上角人格选择器
├── panel.css
├── state.json         当前选中的人格（自动生成，重启保持）
└── personas\          人格库，一个 .json 一张卡
    ├── xiao-jing.json
    └── translator.json
```

一张人格卡就是一份 JSON：

```json
{
  "id": "xiao-jing",
  "name": "小鲸",
  "avatar": "🐳",
  "summary": "住在电脑里的小鲸鱼助手，语气轻快",
  "identity": "你是谁",
  "traits": "性格特质",
  "voice": "说话方式",
  "likes": "喜欢什么",
  "dislikes": "讨厌什么",
  "habits": "习惯和小动作",
  "relationship": "对用户的态度",
  "boundaries": "边界、不会做的事",
  "examples": ["示例台词 1", "示例台词 2"]
}
```

加一张卡：把新 JSON 丢进 Personality Card 目录，点一下按钮就有了（选择器每 3 秒自动刷新）。

接口（也可以直接用 curl 调）：

| 接口 | 作用 |
|---|---|
| `GET  /__plugins/api/system-prompt/list` | 卡片列表 + 当前选中 |
| `POST /__plugins/api/system-prompt/select` | `{"id":"xiao-jing"}` 切换 |
| `POST /__plugins/api/system-prompt/off` | 关掉人格 |
| `POST /__plugins/api/system-prompt/preview` | `{"id":"catgirl"}` 看编译出的 system prompt |
| `POST /__plugins/api/system-prompt/save` | `{"persona":{...}}` 新建/修改 |
| `POST /__plugins/api/system-prompt/delete` | `{"id":"..."}` 删除 |

`options.mode`：`prepend`（只在没有 system 时补）或 `replace`（顶掉模型自带设定）。


## 端口 / 模型

改 `host\host.json`：

```json
{
  "listen": { "port": 8080 },
  "server": { "port": 8081 },
  "model": "models/MiniCPM5-1B-F16.gguf",
  "context": 32768,
  "ngl": 999,
  "extraArgs": ["--flash-attn", "auto"],
  "debug": false
}
```

`debug: true` 会把每次请求的上游 JSON 写进 `host\last-request.json`，写插件时排查用。

## 卸载

删掉 `Plugin\Plugin Library\<插件名>` 即可。想彻底不要插件系统，删掉整个 `Plugin\`，llama.cpp 一点没动。
