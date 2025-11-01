'use strict';

(function() {
    function setToggleStructure() {
        const toggles = document.querySelectorAll('.toggle');
        if(toggles.length === 0) {
            return;
        }
        for(const toggle of toggles) {
            const parent = toggle.parentElement;
            const wrapper = document.createElement('div');
            wrapper.className = 'toggle-wrap';
            wrapper.innerHTML = toggle.outerHTML;
            parent.appendChild(wrapper);
            toggle.remove();
        }
    }

    function handleToggleChange() {
        const toggles = document.querySelectorAll('.toggle');
        if(toggles.length === 0) {
            return;
        }
        for(const toggle of toggles) {
            toggle.addEventListener('change', () => {
                const parent = toggle.parentElement;
                if(toggle.checked) {
                    toggle.value = 1;
                } else {
                    toggle.value = 0;
                }
                parent.classList.toggle('checked');
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        setToggleStructure();
        handleToggleChange();
    });
})();