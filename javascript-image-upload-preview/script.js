'use strict';

(function () {
  function fileToDataURI(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.onerror = () => reject;
      reader.readAsDataURL(file);
    });
  }

  function handleFile(input, preview, thumb, caption) {
    input.addEventListener('change', async (e) => {
        preview.classList.remove('visible');
        const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
        if(!file) {
            return;
        }
        const src = await fileToDataURI(file);
        const fileName = file.name;

        thumb.setAttribute('src', src);
        caption.innerText = fileName;
        preview.classList.add('visible');

    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('image');
    const preview = document.querySelector('.image-preview');
    const thumb = document.querySelector('.image-thumb');
    const caption = preview.querySelector('figcaption');

    handleFile(input, preview, thumb, caption);
  });
})();
