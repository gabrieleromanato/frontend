'use strict';

(function () {

  function fileToText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.onerror = () => reject;
      reader.readAsText(file);
    });
  }

  function handleFile(input, preview) {
    input.addEventListener('change', async (e) => {
      preview.classList.remove('visible');
      const file =
        e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
      if (!file) {
        return;
      }
      const text = await fileToText(file);
      const codeBlock = preview.querySelector('code');
      codeBlock.innerText = text;
      preview.classList.add('visible');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('code');
    const preview = document.querySelector('.code-preview');

    handleFile(input, preview);
  });
})();
