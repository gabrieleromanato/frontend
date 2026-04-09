'use strict';

(function () {
  function passwordScore(value = '') {
    if (!value) return 0;

    let score = 0;

    if (/[a-z]/.test(value)) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/\W/.test(value)) score += 4;

    if (value.length >= 8) score += 1;
    if (value.length >= 12) score += 1;
    if (value.length >= 16) score += 1;

    return Math.min(Math.round((score / 10) * 100), 100);
  }

  function strengthLevel(score = 0) {
    if (score <= 25)
      return {
        label: 'Weak',
        colorClass: 'password-strength-label text-danger',
        barClass: 'password-strength-level bg-danger',
      };
    if (score <= 50)
      return {
        label: 'Medium',
        colorClass: 'password-strength-label text-warning',
        barClass: 'password-strength-level bg-warning',
      };
    if (score <= 75)
      return {
        label: 'Good',
        colorClass: 'password-strength-label text-medium',
        barClass: 'password-strength-level bg-medium',
      };
    return {
      label: 'Strong',
      colorClass: 'password-strength-label text-success',
      barClass: 'password-strength-level bg-success',
    };
  }

  function canShow(element = null, password = '') {
      if(password.length > 0) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
  }

  function handleEvent(evt) {
    const inputElement = evt.target;
    const checker = inputElement.nextElementSibling;
    if(!checker || !checker.classList.contains('password-strength')) {
        return;
    }
    const password = inputElement.value;
    const level = checker.querySelector('.password-strength-level');
    const label = checker.querySelector('.password-strength-label');
    const score = passwordScore(password);
    const width = `${score}%`;
    const data = strengthLevel(score);
    canShow(checker, password);
    level.style.width = width;
    level.className = data.barClass;
    label.className = data.colorClass;
    label.innerText = data.label;
  }

  function handleEvents() {
    const input = document.getElementById('password');
    if(!input) {
        return;
    }
    input.addEventListener('input', handleEvent, false);
    input.addEventListener('paste', handleEvent, false);
  }

  document.addEventListener('DOMContentLoaded', handleEvents, false);
})();
