'use strict';

(function () {
  function getRandomInt(min = 1, max = 10) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  function createQuestionAndAnswer() {
    const a = getRandomInt(1, 100);
    const b = getRandomInt(1, 100);
    const sum = a + b;
    return {
      question: `${a} + ${b} = ?`,
      answer: sum,
    };
  }

  function handleQuizReset() {
    const resultElement = document.getElementById('quiz-result');
    const quizCounter = document.getElementById('quiz-counter');
    const quizStatus = document.getElementById('quiz-status');
    const quizAnswer = document.getElementById('quiz-answer');
    const quizForm = document.getElementById('quiz-form');

    quizForm.removeEventListener('submit', handleQuizFormSubmit);
    resultElement.classList.add('d-none');
    resultElement.innerHTML = '';
    quizCounter.innerText = '';
    quizStatus.innerText = '';
    quizAnswer.value = '';
  }

  function handleQuizFormSubmit(evt) {
      evt.preventDefault();
      const form = evt.target;
      const quizAnswer = form.querySelector('#quiz-answer');
      const answer = parseInt(quizAnswer.value, 10);
      quizAnswer.dataset.answer = answer;
      quizAnswer.value = '';
  }

  function handleQuizTimer(duration = 10) {
    const quizCounter = document.getElementById('quiz-counter');
    quizCounter.innerText = duration;
    return new Promise((resolve, reject) => {
      let counter = 0;
      let timer = setInterval(() => {
        counter++;
        quizCounter.innerText = `${duration - counter}`;
        if (counter === duration) {
          clearInterval(timer);
          resolve(true);
        }
      }, 1000);
    });
  }

  function handleQuiz(totalDuration = 10, answerElement = null) {
    return new Promise((resolve, reject) => {
      const quizQuestion = document.getElementById('question');
      let isCorrect = false;

      let question = createQuestionAndAnswer();
      quizQuestion.innerText = question.question;

      handleQuizTimer(totalDuration).then(() => {
        let answer = parseInt(answerElement.dataset.answer, 10);
        if (answer === question.answer) {
          isCorrect = true;
        }
        quizQuestion.innerText = '';
        resolve({
          question: question.question,
          answer: isNaN(answer) ? '' : answer,
          isCorrect,
        });
      });
    });
  }

  async function handleQuizSeries(total = 3) {
    const quizAnswer = document.getElementById('quiz-answer');
    const quizForm = document.getElementById('quiz-form');
    const resultElement = document.getElementById('quiz-result');
    const quizStatus = document.getElementById('quiz-status');
    const quizStart = document.getElementById('quiz-start');

    let results = [];

    quizForm.addEventListener(
      'submit',
      handleQuizFormSubmit,
      false
    );

    for (let i = 0; i < total; i++) {
      quizStatus.innerText = `${i + 1}/${total}`;
      const result = await handleQuiz(10, quizAnswer);
      results.push(result);
    }

    let html = '';

    for (const res of results) {
      html += `<div class="mb-3"><strong>${
        res.question
      }</strong> <span class="${
        res.isCorrect ? 'text-success' : 'text-danger'
      }">${res.answer}</span></div>`;
    }

    resultElement.innerHTML = html;
    resultElement.classList.remove('d-none');
    quizStart.classList.remove('d-none');
  }

  function handleQuizStart() {
    document.getElementById('quiz-start').addEventListener(
      'click',
      function () {
        handleQuizReset();
        handleQuizSeries();
        this.classList.add('d-none');
      },
      false
    );
  }

  function init() {
    handleQuizStart();
  }

  document.addEventListener(
    'DOMContentLoaded',
    () => {
      init();
    },
    false
  );
})();
