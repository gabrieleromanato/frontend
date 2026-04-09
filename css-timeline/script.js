'use strict';

(function() {
    const SAMPLE_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

    function getSampleText(text = '', delim = ',') {
        const parts = text.split(delim).sort(() => Math.random() - 0.5);
        const sentence = parts[0].trim();
        return sentence + delim;
    }
    
    function generateTimeLineData(years = 5) {
        let startYear = new Date().getFullYear();
        let data = [];
        for(let i = 0; i < years; i++) {
            let year = startYear--;
            data.push({
                label: year,
                description: getSampleText(SAMPLE_TEXT, '.')
            });
        }
        return data;
    }

    function insertTimeLineData(selector = '') {
        const timeline = document.querySelector(selector);
        if(!timeline) {
            return;
        }
        const data = generateTimeLineData(7);
        let html = '';

        for(const datum of data) {
            html += `<dt>${datum.label}</dt><dd>${datum.description}</dd>`;
        }
        timeline.innerHTML = html;
    }

    document.addEventListener('DOMContentLoaded', () => {
        insertTimeLineData('.timeline');
    }, false);
})();