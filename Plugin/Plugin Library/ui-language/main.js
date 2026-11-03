'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;

/* 从源码里收集 "key": value 行的键名（去重；EXTRA 各批次与 DICT 有重合，不能按行数算） */
function keysIn(text) {
  const set = new Set();
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.slice(0, 5) !== "    '" && line.slice(0, 5) !== '    "') continue;
    const cut = line.indexOf("': ");
    const cutD = line.indexOf('": ');
    const at = cut >= 0 ? cut : cutD;
    if (at > 5) set.add(line.slice(5, at));
  }
  return set;
}

module.exports = {
  webui: { js: 'translate.js', css: 'style.css' },

  init(ctx) {
    ctx.log('UI language 已加载（中文 / 日本語 / English）');
    ctx.log('增删词条直接改 translate.js 顶部的 DICT（中文）/ DICT_JA（日文）即可');
  },

  routes: {
    '/stats': () => {
      const file = path.join(DIR, 'translate.js');
      const src = fs.readFileSync(file, 'utf8');
      const jaStart = src.indexOf('var DICT_JA = {');
      const jaEnd = jaStart >= 0 ? src.indexOf('\n  };', jaStart) : -1;
      const jaSrc = (jaStart >= 0 && jaEnd > jaStart) ? src.slice(jaStart, jaEnd) : '';
      const outside = jaStart >= 0 ? src.slice(0, jaStart) + src.slice(jaEnd) : src;
      const zhKeys = keysIn(outside);
      const jaKeys = keysIn(jaSrc);
      let missing = 0;
      jaKeys.forEach(function (k) { if (!zhKeys.has(k)) missing++; });
      return {
        langs: ['zh', 'ja', 'en'],
        zh: zhKeys.size,
        ja: jaKeys.size,
        jaMissing: missing,
        file: file,
        note: 'DICT（中文）与 DICT_JA（日文）的去重词条数；jaMissing 为日文缺失条数'
      };
    }
  }
};
