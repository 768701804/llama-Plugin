'use strict';

module.exports = {
  webui: { js: 'webui.js', css: 'style.css' },

  // 把插件数量写进页面，前端直接读，省得再发请求
  onHtml(html) {
    const plugins = (String(html).match(/__PLUGIN_COUNT__/g) || []).length;
    return html;
  },

  routes: {
    '/info': () => ({ name: '界面角标', note: '纯前端插件示例' })
  }
};
