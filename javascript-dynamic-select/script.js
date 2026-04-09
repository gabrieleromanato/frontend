'use strict';

(function() {

    const DATA = [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
        { label: 'Three', value: 3 }
    ];

    function handleDynamicChangeEvent() {
        document.addEventListener('change', evt => {
            const element = evt.target;
            if(element.classList.contains('dynamic-select')) {
                element.nextElementSibling.innerText = element.options[element.selectedIndex].value;
            }
        }, false);
    }

    function createDynamicSelect(target = null, items = []) {
        if(!target || items.length === 0) {
            return;
        }
        const select = document.createElement('select');
        select.className = 'dynamic-select';

        let html = ['<option value="">Select an option</option>'];

        for(const item of items) {
            const option = `<option value="${item.value}">${item.label}</option>`;
            html.push(option);
        }

        select.innerHTML = html.join('');
        target.insertAdjacentHTML('beforeBegin', select.outerHTML);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const output = document.querySelector('form .output');
        handleDynamicChangeEvent();
        createDynamicSelect(output, DATA);
    });

})();