'use strict';

(function () {
  function handleIframeHeight() {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;
    window.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'widget-height') {
        iframe.style.height = e.data.height + 'px';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', handleIframeHeight, false);
})();
