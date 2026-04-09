'use strict';

(function () {
  function handleValue(input = null) {
    if (!input) {
      return false;
    }
    const value = input.value.trim();
    if (/^\d$/.test(value)) {
      const next = input.nextElementSibling;
      if (next) {
        next.focus();
      }
      return true;
    }
    if (/^\d{6}$/.test(value)) {
      const parts = value.split('');
      const inputs = input.parentNode.querySelectorAll('input');
      for (let i = 0; i < parts.length; i++) {
        inputs[i].value = parts[i];
      }
      return true;
    }
  }

  function handleEvents(inputSelector = '') {
    const inputs = document.querySelectorAll(inputSelector);

    for (const input of inputs) {
      input.addEventListener(
        'input',
        function () {
          handleValue(this);
        },
        false,
      );
      input.addEventListener(
        'paste',
        function () {
          handleValue(this);
        },
        false,
      );
    }
  }

  function generateOtpCode(length = 6) {
    const digits = '0123456789'.split('');
    let code = '';
    for (let i = 0; i < length; i++) {
      let idx = Math.floor(Math.random() * digits.length);
      code += digits[idx];
    }
    return code;
  }

  function displayOtpCode(targetEl = null, code = '') {
    if (!targetEl) {
      return;
    }
    targetEl.innerText = code;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const otpCodeElement = document.querySelector('.otp-code');
    const otpCode = generateOtpCode();
    displayOtpCode(otpCodeElement, otpCode);
    handleEvents('.form-input');
  });
})();
