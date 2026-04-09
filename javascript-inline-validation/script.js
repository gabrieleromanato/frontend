'use strict';

(function() {

    function validateField(input = null) {
        if(!input) {
            return;
        }
        input.classList.remove('form-input-error');
        if(input.nextElementSibling) {
            input.nextElementSibling.remove();
        }
        const tag = input.tagName.toLowerCase();
        const value = input.value;
        let isValid = true;

        switch(tag) {
            case 'input':
                const type = input.type;
                if(type === 'checkbox' || type === 'radio') {
                    isValid = input.checked;
                } else if(type === 'email') {
                    isValid = validator.isEmail(value);
                } else {
                    isValid = !validator.isEmpty(value);
                }
                break;
            case 'textarea':
            case 'select':
                isValid = !validator.isEmpty(value);
                break;
            default:
                break;
        }

        if(!isValid) {
            input.classList.add('form-input-error');
            const error = document.createElement('div');
            error.className = 'form-error';
            error.innerText = input.dataset.error;
            input.after(error);
        }

        return isValid;
    }

    function resetField(input = null) {
        if(!input) {
            return;
        }
        input.classList.remove('form-input-error');
        if(input.nextElementSibling) {
            input.nextElementSibling.remove();
        } 
        const form = input.parentElement.parentElement;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.removeAttribute('disabled'); 
    }

    function handleInputValidation(form = null) {
        if(!form) {
            return;
        }
        const inputs = form.querySelectorAll('input[required]');
        for(const input of inputs) {
            input.addEventListener('blur', function() {
                validateField(this);
            }, false);
            input.addEventListener('focus', function() {
                resetField(this);
            }, false);
        }
    }

    function handleFormSubmit(form = null) {
        if(!form) {
            return;
        }
        form.addEventListener('submit', evt => {
            evt.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.removeAttribute('disabled');
            const inputs = form.querySelectorAll('input[required]');
            const last = inputs[inputs.length - 1];
            const valid = validateField(last);
            if(!valid) {
                submitBtn.setAttribute('disabled', true);
            }
        }, false);
    }

    function init() {
        if(!validator) {
            return;
        }
        const form = document.querySelector('.app-form');
        handleInputValidation(form);
        handleFormSubmit(form);
    }

    document.addEventListener('DOMContentLoaded', init, false);

})();