'use strict';

(function () {
  const cache = {};

  const factorial = (n = 0) => {
    if (n === 0) {
      return 1;
    }
    return n * factorial(n - 1);
  };

  function getFactorialCached(num) {
    if (cache[num]) {
      return cache[num];
    }
    const result = factorial(num);
    cache[num] = result;
    return result;
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const num = event.target.elements.number.value;
    const appError = document.querySelector('.app-error');
    appError.classList.remove('visible');
    const appResult = document.querySelector('.app-result');
    appResult.classList.remove('visible');

    if (isNaN(parseInt(num, 10))) {
      appError.textContent = 'Please enter a valid number';
      appError.classList.add('visible');
      return;
    }

    const result = getFactorialCached(num);
    appResult.innerHTML = result;
    appResult.classList.add('visible');
  }

  document.addEventListener(
    'DOMContentLoaded',
    () => {
      const appForm = document.querySelector('.app-form');
      appForm.addEventListener('submit', handleFormSubmit);
    },
    false
  );
})();
