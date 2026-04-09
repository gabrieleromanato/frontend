'use strict';

(function() {
    function markDownToHTML(sourceEl = null, targetEl = null) {
        if(!marked) return;
        if(!sourceEl || !targetEl) return;

        targetEl.value = marked.parse(sourceEl.value);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const convertBtn = document.getElementById('convert');
        if(!convertBtn) return;
        const sourceEl = document.getElementById('markdown');
        const targetEl = document.getElementById('output');

        convertBtn.addEventListener('click', () => {
            markDownToHTML(sourceEl, targetEl);
        }, false);
    }, false);
})();