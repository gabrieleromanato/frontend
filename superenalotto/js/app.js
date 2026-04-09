'use strict';

(function () {

    const MAX_NUMBERS = 6;
    const PRICE_PER_CARD = 1.00;
    const MINIMUM_COMBINATION_LENGTH = 2;
    let cards = {};
    let progresses = {};

    const CardSlider = {
        numItems: function () {
            return document.querySelectorAll('.card-wrapper').length;
        },
        current: 1,
        init: function () {
            document.querySelectorAll('.card-wrapper').forEach((card, index) => {
                card.setAttribute('data-position', index + 1);
                card.style.order = index + 1;
            });
            this.addEvents();
        },
        addEvents: function () {
            const that = this;
            document.querySelector('.cards-actions .next-btn').addEventListener('click', () => {
                that.gotoNext();
            }, false);
            document.querySelector('#cards').addEventListener('transitionend', () => {
                that.changeOrder();
            }, false);
        },    
        changeOrder: function() {
            if(this.current === this.numItems()) {
                this.current = 1;
            } else {
                this.current++;
            }
            let order = 1;
            for(let i = this.current; i <= this.numItems(); i++) {
                document.querySelector(`.card-wrapper[data-position="${i}"]`).style.order = order;
                order++;
            }
            for(let i = 1; i < this.current; i++) {
                document.querySelector(`.card-wrapper[data-position="${i}"]`).style.order = order;
                order++;
            }
            document.querySelector('#cards').classList.remove('cards-transition');
            document.querySelector('#cards').style.transform = 'translateX(0)';
        },
        gotoNext: function () {
            document.querySelector('#cards').classList.add('cards-transition');
            document.querySelector('#cards').style.transform = 'translateX(-100%)';
        }   
    };

    function createPayPalButtons() {
        const transactionElement = document.getElementById('transaction');
        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical'
            
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: document.querySelector('.cards-price .price').textContent
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    transactionElement.textContent = 'Transaction completed by ' + details.payer.name.given_name + '!';
                    resetGame();
                });
            },
            onCancel: function (data) {
                transactionElement.textContent = 'Transaction cancelled!';
            },
            onError: function (err) {
                transactionElement.textContent = 'Transaction error!';
            }
        }).render('#paypal-button-container');
    }
                        

    function resetGame() {
        cards = {};
        progresses = {};
        const cardsElement = document.querySelector('.cards');
        cardsElement.innerHTML = '';
        const cardsResults = document.querySelector('.cards-results');
        cardsResults.innerHTML = '';
        const cardsActions = document.querySelector('.cards-actions');
        cardsActions.classList.remove('visible');
        const priceElement = document.querySelector('.cards-price .price');
        priceElement.textContent = '0.00';
    }

    function closeCardsSummary() {
        const cardSummary = document.getElementById('cards-summary');
        const btnClose = cardSummary.querySelector('.close-btn');
        btnClose.addEventListener('click', () => {
            cardSummary.close();
            resetGame();
        }, false);
    }
    
    function createRandomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function checkIfNumberIsInCombinations(number, combinations) {
        for(const cardID in combinations) {
            const combination = combinations[cardID];
            if(combination.includes(number)) {
                return true;
            }
        }
        return false;
    }

    function displayCardsSummary(results, combinations) {
        const cardsResults = document.querySelector('.cards-results');
        let resultsHTML = '<div class="winning">';
        for(const result of results) {
            const cssClass = checkIfNumberIsInCombinations(result, combinations) ? 'winning-number' : '';
            resultsHTML += `<span class="${cssClass}">${result}</span>`;
        }
        resultsHTML += '</div>';
        let message = 'You lose';
        let cssClass = 'lost';
        for(const cardID in combinations) {
            const combination = combinations[cardID];
            if(combination.length >= MINIMUM_COMBINATION_LENGTH) {
                message = 'You win';
                cssClass = 'won';
                break;
            }
        }
        resultsHTML += `<div class="cards-result ${cssClass}">${message}</div>`;        
        cardsResults.innerHTML = resultsHTML;
    }    

    function showCardsSummary() {
        const proceedButton = document.querySelector('.cards-actions .proceed-btn');
        const cardSummary = document.getElementById('cards-summary');
        proceedButton.addEventListener('click', () => {
            const {results, combinations} = createGameResults();
            displayCardsSummary(results, combinations);
            cardSummary.showModal();
        }, false);
    }        

    function createCardID(prefix = 'card-') {
        return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
    }

    function setPricePerCard() {
        const priceElement = document.querySelector('.cards-price .price');
        const cards = document.querySelectorAll('.card-wrapper');
        const cardsCount = cards.length;
        const totalPrice = PRICE_PER_CARD * cardsCount;
        priceElement.textContent = totalPrice.toFixed(2);
    }


    function createNumberRange(start, end) {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    function createGameResults() {
        const results = [];
        for(let i = 0; i < MAX_NUMBERS; i++) {
            const number = createRandomNumberBetween(1, 90);
            if(!results.includes(number)) {
                results.push(number);
            } else {
                results.push(createRandomNumberBetween(1, 90));
            }    
        }
        const combinations = {};
        if(Object.keys(cards).length > 0) {
            for(const cardID in cards) {
                const card = cards[cardID];
                const intersection = card.filter(x => results.includes(x));
                combinations[cardID] = intersection;
            }
        } 
        return {results, combinations};   
    }

    function setProgress(cardID = '',context = document, increment = true) {
        const progressElement = context.querySelector('.card-progress div');
        progresses[cardID] = increment ? progresses[cardID] + 1 : progresses[cardID] - 1;
        progressElement.style.width = `${progresses[cardID] * 16.6666666667}%`;
    }

    function createCardNumbers(targetElement) {
        const cardNumbers = createNumberRange(1, 90);
        let html = [];
        for(const num of cardNumbers) {
            html.push(`<div class="card-number">${num}</div>`);
        }
        targetElement.innerHTML = html.join('');
    }

    function handleClick(evt, number) {

        const cardID = evt.target.parentNode.id;
        
        if(cards[cardID].length === MAX_NUMBERS && !cards[cardID].includes(number)) {
            return;
        }
        if (!cards[cardID].includes(number)) {
            addSelectedNumber(cardID, number);
            evt.target.classList.add('selected');
            setProgress(cardID, evt.target.parentNode.parentNode, true);
        } else {
            removeSelectedNumber(cardID, number);
            evt.target.classList.remove('selected');
            setProgress(cardID, evt.target.parentNode.parentNode, false);
        }
        handleCardsActionsVisibility(document, document.querySelector('.cards-actions'));
    }

    function handleCardNumberClick() {
        document.addEventListener('click', (evt) => {
            if (evt.target.classList.contains('card-number')) {
                handleClick(evt, parseInt(evt.target.textContent));
            }
        }, false);
    }

    function addSelectedNumber(cardID, number) {
        cards[cardID].push(number);
    }

    function removeSelectedNumber(cardID, number) {
       cards[cardID].splice(cards[cardID].indexOf(number), 1);
    }

    function createCard(targetElement) {
        const wrapper = document.createElement('div');
        wrapper.className = 'card-wrapper';
        const header = document.createElement('header');
        header.className = 'card-header';
        header.innerHTML = '<strong>Choose 6 numbers</strong><div class="card-progress"><div></div></div>';
        wrapper.appendChild(header);
        const card = document.createElement('div');
        const cardID = createCardID();
        card.className = 'card';
        card.id = cardID;
        wrapper.appendChild(card);
        targetElement.appendChild(wrapper);
        createCardNumbers(card);
        cards[cardID] = [];
        progresses[cardID] = 0;
    }

    function handleCardAddButton() {
        const addButton = document.querySelector('.add-card');
        const cards = document.querySelector('.cards');
        addButton.addEventListener('click', () => {
            createCard(cards);
            setPricePerCard();
            CardSlider.init();
            if(CardSlider.numItems() > 1) {
                const nextButton = document.querySelector('.cards-actions .next-btn');
                const clickEvent = new Event('click');
                nextButton.dispatchEvent(clickEvent);
            }
        }, false);
    }

    function handleCardsActionsVisibility(context, cardsActionsElement) {
        const numbersSelected = context.querySelectorAll('.card-number.selected');
        if(numbersSelected.length  >= MAX_NUMBERS) {
            cardsActionsElement.classList.add('visible');
        } else {
            cardsActionsElement.classList.remove('visible');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        createPayPalButtons();
        handleCardNumberClick();
        handleCardAddButton();
        showCardsSummary();
        closeCardsSummary();

    }, false);

})();