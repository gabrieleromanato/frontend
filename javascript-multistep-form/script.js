'use strict';

(function() {
    function validateCurrentStep(step = null) {
        if(!step) return;
        const requiredInputs = step.querySelectorAll('input[required]');
        let valid = true;
        for(const input of requiredInputs) {
            if(!input.value || input.value.length === 0 || /^\s+$/.test(input.value)) {
                valid = false;
            }
        }
        return valid;
    }

    function hideSteps(form = null, currentStep = null) {
        if(!form || !currentStep) return;
        const steps = form.querySelectorAll('fieldset');
        currentStep.classList.remove('hidden');
        for(const step of steps) {
            if(step.id !== currentStep.id) {
                step.classList.add('hidden');
            }
        }
    }

    function disableNavigationButtons(nav = null, currentButton = null) {
        if(!nav || !currentButton) return;
        const buttons = nav.querySelectorAll('button');
        currentButton.classList.add('active');
        for(const button of buttons) {
            if(button.dataset.step !== currentButton.dataset.step) {
                button.classList.remove('active');
            }
        }
    }

    function handleFormNavigation(form = null) {
        if(!form) return;
        const navigationButtons = form.querySelectorAll('.form-multistep-navigation button');
        const message = form.querySelector('.form-message');
        for(const button of navigationButtons) {
            button.addEventListener('click', function() {
                message.classList.add('hidden');
                message.classList.remove('error');
                message.innerText = '';
                const previous = this.previousElementSibling;
                if(!previous) {
                    hideSteps(form, document.querySelector(this.dataset.step));
                    disableNavigationButtons(this.parentElement, this);
                    return;
                }
                const step = document.querySelector(previous.dataset.step);
                const validated = validateCurrentStep(step);
                if(!validated) {
                    message.classList.add('error');
                    message.innerText = 'Missing required fields.';
                    message.classList.remove('hidden');
                    return;
                }
                hideSteps(form, document.querySelector(this.dataset.step));
                disableNavigationButtons(this.parentElement, this);
            }, false);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector('.form-multistep');
        handleFormNavigation(form);
    });
})();