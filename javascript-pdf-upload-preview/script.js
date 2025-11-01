'use strict';

(function () {
  function handleFile(input, wrapper, preview) {
    input.addEventListener('change', async (e) => {

      wrapper.classList.remove('visible');
      document.body.classList.remove('preview-visible');

      const file = e.target.files[0];
      if (!file) return;

      const fileURL = URL.createObjectURL(file);

      
      const pdf = await pdfjsLib.getDocument(fileURL).promise;

      
      const page = await pdf.getPage(1);

      
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      preview.width = viewport.width;
      preview.height = viewport.height;

      const ctx = preview.getContext('2d');

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      wrapper.classList.add('visible');
      document.body.classList.add('preview-visible');

      await page.render(renderContext).promise;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('pdf');
    const preview = document.getElementById('pdf-preview');
    const wrapper = document.getElementById('pdf-preview-wrapper');
    const closeButton = document.getElementById('pdf-preview-close');

    closeButton.addEventListener('click', () => {
        wrapper.classList.remove('visible');
        document.body.classList.remove('preview-visible');
    });

    handleFile(input, wrapper, preview);
  });
})();
