'use strict';

(function() {

    function toggleOverlay() {
        const overlay = document.getElementById('gallery-overlay');
        if(!overlay) {
            return;
        }
        overlay.classList.toggle('visible');
    }

    function setCurrentImage(hashStr = '') {
        if(!hashStr) {
            return;
        }
        const image = document.querySelector(hashStr);
        if(!image) {
            return;
        }
        const overlay = document.getElementById('gallery-overlay');
        if(!overlay) {
            return;
        }
        const overlayImage = overlay.querySelector('img');
        overlayImage.src = image.src;
        overlayImage.alt = image.alt;
    }

    function handleHashChangeEvt() {
        if(!location.hash || !location.hash.includes('image-')) {
            return;
        }
        const currentHash = location.hash;
        setCurrentImage(currentHash);
        toggleOverlay();
    }

    function resetOverlay() {
        const overlay = document.getElementById('gallery-overlay');
        if(!overlay) {
            return;
        }
        const overlayImage = overlay.querySelector('img');
        overlayImage.src = '';
        overlayImage.alt = '';    
    }

    function handleCloseOverlayEvt() {
        toggleOverlay();
        resetOverlay();
    }

    function init() {
        document.addEventListener('click', evt => {
            const target = evt.target;
            if(target.id && target.id === 'gallery-overlay') {
                handleCloseOverlayEvt();
            }
        }, false);
        window.addEventListener('hashchange', () => {
            handleHashChangeEvt();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        init();
    }, false);

})();