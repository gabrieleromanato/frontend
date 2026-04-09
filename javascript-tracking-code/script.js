'use strict';

(function() {
    function getRandomItem(arr = []) {
        return arr.sort(() => Math.random() - 0.5)[0];
    }

    function digits(len = 8) {
        const chars = '0123456789'.split('');
        let output = '';
        for(let i = 0; i < len; i++) {
            let char = getRandomItem(chars);
            output += char;
        }
        return output;
    }

    function alpha(len = 8, upper = false) {
        const chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
        let output = '';
        for(let i = 0; i < len; i++) {
            let char = getRandomItem(chars);
            output += char;
        }
        return upper ? output.toUpperCase() : output;
    }

    function createNationalShippingCode() {
        return alpha(2, true) + ' ' + digits(9);
    }

    function isValidNationalShippingCode(value = '') {
        return /^[A-Z]{2}\s\d{9}$/.test(value);
    }

    function createInternationalShippingCode() {
        return digits(11);
    }

    function isValidInternationalShippingCode(value) {
        return /^\d{11}$/.test(value);
    }

    function createShippingUnitCode() {
        return digits(8);
    }

    function isValidShippingUnitCode(value = '') {
        return /^\d{8}$/.test(value);
    }

    function createShippingNoteCode() {
        return alpha(2, true) + digits(11);
    }

    function isValidShippingNoteCode(value = '') {
        return /^[A-Z]{2}\d{11}$/.test(value);
    }

    function resetChoices() {
        const form = document.getElementById('tracking-form');
        const checks = form.querySelectorAll('input[type="checkbox"]');
        for(const check of checks) {
            check.checked = false;
        }

    }

    function handleTrackingCodeInput(evt) {
        const input = evt.target;
        const value = input.value;
        let checkboxReference = '';
        resetChoices();

        if(isValidNationalShippingCode(value)) {
            checkboxReference = 'national';
        } else if (isValidInternationalShippingCode(value)) {
            checkboxReference = 'international';
        } else if(isValidShippingUnitCode(value)) {
            checkboxReference = 'shipping-unit';
        } else if(isValidShippingNoteCode(value)) {
            checkboxReference = 'shipping-note';
        }

        if(!checkboxReference) {
            return;
        }

        const checkbox = document.getElementById(checkboxReference);

        if(!checkbox) {
            return;
        }

        checkbox.checked = true;
    }

    function handleCreateCodeButton() {
        const actions = ['national', 'international','shipping-unit', 'shipping-note'];
        const action = getRandomItem(actions);
        let code = '';
        switch(action) {
            case 'national':
                code = createNationalShippingCode();
                break;
            case 'international':
                code = createInternationalShippingCode();
                break;
            case 'shipping-unit':
                code = createShippingUnitCode();
                break;
            case 'shipping-note':
                code = createShippingUnitCode();
                break;
            default:
                break;
        }
        if(code) {
            const input = document.getElementById('tracking-code');
            input.value = code;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function init() {
        const btnCreate = document.getElementById('create-tracking-code');
        btnCreate.addEventListener('click', handleCreateCodeButton);
        const trackingCodeInput = document.getElementById('tracking-code', false);
        trackingCodeInput.addEventListener('input', handleTrackingCodeInput, false);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
})();