'use strict';

(function() {
    function hideContent(container = null, itemsCount = 5) {
        if(!container) {
            return;
        }
        const items = Array.from(container.querySelectorAll('p'));

        if(items.length === 0) {
            return;
        }

        items.slice(itemsCount - 1).forEach((item) => {
            item.classList.add('content-item', 'hidden');
        });
    }

    function addReadMoreButton(container = null) {
        if(!container) {
            return;
        }
        const hiddenItems = container.querySelectorAll('.hidden');
        if(hiddenItems.length === 0) {
            return;
        }

        const target = hiddenItems[0];

        const btnContainer = document.createElement('div');
        btnContainer.className = 'read-more-wrapper';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'read-more';
        btn.innerText = 'Read More...';
        btnContainer.appendChild(btn);
        target.insertAdjacentElement('beforebegin', btnContainer);
    }

    function handleReadMoreButton() {
        const button = document.querySelector('.read-more');
        if(!button) {
            return;
        }
        const items = document.querySelectorAll('.content-item');
        if(items.length === 0) {
            return;
        }

        button.addEventListener('click', () => {
            const areHidden = Array.from(items).every(item => item.classList.contains('hidden'));
            if(areHidden) {
                for(const item of items) {
                    item.classList.remove('hidden');
                }
                button.innerText = 'Read Less...';
            } else {
                for(const item of items) {
                    item.classList.add('hidden');
                }
                button.innerText = 'Read More...';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.post');
        hideContent(container, 4);
        addReadMoreButton(container);
        handleReadMoreButton();
    });
})();