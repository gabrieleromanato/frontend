'use strict';

(function() {

    const TRANSITION_DELAY = 400;

    const showOverlay = () => {
        const overlay = document.getElementById('gallery-view');
        overlay.style.display = 'block';
        overlay.style.opacity = 1;
        document.documentElement.classList.add('no-scroll');
    };

    const hideOverlay = () => {
        const overlay = document.getElementById('gallery-view');
        overlay.style.opacity = 0;
        setTimeout(() => {
            overlay.style.display = 'none';
            document.documentElement.classList.remove('no-scroll');
        }, TRANSITION_DELAY);
    };

    const closeOverlay = () => {
        const close = document.getElementById('gallery-view-close');
        close.addEventListener('click', e => {
            e.preventDefault();
            hideOverlay();
        }, false);
    };

    const handleViewButtons = () => {
        const buttons = document.querySelectorAll('.view');
        const content = document.getElementById('gallery-image');
        for(const button of buttons) {
            button.addEventListener('click', function() {
                let src = this.previousElementSibling.getAttribute('src');
                content.innerHTML = `<img src="${src}">`;
                showOverlay();

            }, false);
        }
    };


    document.addEventListener('DOMContentLoaded', () => {
        closeOverlay();
        handleViewButtons();
    }, false);
})();