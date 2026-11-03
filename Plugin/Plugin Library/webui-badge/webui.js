(function () {
  'use strict';

  function mount() {
    if (document.getElementById('llama-plugin-badge')) return;
    var list = window.__LLAMA_PLUGINS__ || [];
    var el = document.createElement('div');
    el.id = 'llama-plugin-badge';
    el.title = list.map(function (p) { return p.name; }).join(' / ') || '无启用插件';
    el.innerHTML = '<span class="dot"></span><span>插件 ' + list.length + ' 个</span>';
    el.addEventListener('click', function () {
      window.open('/__plugins/admin', '_blank');
    });
    document.body.appendChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
  // 单页应用切换页面时重挂一次
  document.addEventListener('llama-plugins-ready', mount);
  setInterval(mount, 3000);
})();
