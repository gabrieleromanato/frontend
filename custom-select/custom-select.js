'use strict';

(function() {
    function createSelectRandomID() {
        return 'select-' + Math.random().toString(36).slice(2);
    }
    function setUpSelect() {
        const select = document.querySelectorAll('.custom-select');
        if(select.length === 0) {
            return;
        }
        for(const sel of select) {
            const parent = sel.parentElement;
            const id = createSelectRandomID();
            sel.classList.add('hidden');
            sel.setAttribute('data-id', id);

            const menu = document.createElement('div');
            menu.className = 'custom-select-wrapper';
            menu.setAttribute('data-select', id);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'custom-select-toggle';
            btn.innerText = 'Choose an option';
            menu.appendChild(btn);

            const ul = document.createElement('ul');

            const options = sel.querySelectorAll('option');
            let items = '';

            for(const option of options) {
                const value = option.getAttribute('value');
                const text = option.innerText;
                if(!value) {
                    continue;
                }
                items += `
                    <li data-value="${value}">
                        ${text}
                    </li>
                `;

            }
            ul.innerHTML = items;

            menu.appendChild(ul);
            parent.appendChild(menu);
        }

        
    }

    function handleSelect() {
         const toggles = document.querySelectorAll('.custom-select-toggle');
         if(toggles.length === 0) {
            return;
         }   
         for(const toggle of toggles) {
            const wrapper = toggle.parentElement;
            const select = document.querySelector('[data-id="' + wrapper.dataset.select + '"]');
            if(!select) {
                continue;
            }
            const ul = toggle.nextElementSibling;
            if(!ul) {
                continue;
            }
            const items = ul.querySelectorAll('li');
            if(items.length === 0) {
                continue;
            }

            toggle.addEventListener('click', () => {
                ul.classList.toggle('visible');
            });

            for(const item of items) {
                item.addEventListener('click', () => {
                    select.value = item.dataset.value;
                    toggle.innerText = item.innerText;
                    ul.classList.remove('visible');
                });
            }
         }
    }

    document.addEventListener('DOMContentLoaded', () => {
        setUpSelect();
        handleSelect();
    });
})();