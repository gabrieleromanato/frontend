'use strict';

(function () {
  function notifyHeight() {
    const height = document.documentElement.scrollHeight;
    window.parent.postMessage({ type: 'widget-height', height }, '*');
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('load', notifyHeight);
  });
})();
