'use strict';

(function() {
    const getData = async () => {
        try {
            const data = await fetch('products.json');
            const res = await data.json();
            return res.products.map(product => { return { title: product.title }; });
        } catch(err) {
            return [];
        }
    };

    const showSuggeestions = () => {
        document.querySelector('.suggestions').style.display = 'block';
    };

    const hideSuggestions = () => {
        document.querySelector('.suggestions').style.display = 'none';
    };

    const clearSuggestions = () => {
        document.querySelector('.suggestions ul').innerHTML = '';
    };

    const createSuggestion = text => {
        const target = document.querySelector('.suggestions ul');
        const suggestion = document.createElement('li');
        suggestion.className = 'suggestion';
        suggestion.innerText = text;
        target.appendChild(suggestion);
    };

    const getSuggestions = term => {
        const data = sessionStorage.getItem('suggestions');
        if(data === null) {
            return [];
        }
        const suggestions = JSON.parse(data);
        return suggestions.filter(sugg => {
            return sugg.title.toLowerCase().includes(term.toLowerCase());
        });
    };

    const handleSuggestion = () => {
        const suggestionsContainer = document.querySelector('.suggestions');
        suggestionsContainer.addEventListener('click', e => {
            const el = e.target;
            if(el.matches('.suggestion')) {
                document.querySelector('.autosuggest-input').value = el.innerText;
            }
        }, false);
    };

    const validateSuggestions = () => {
        const data = sessionStorage.getItem('suggestions');
        if(data === null) {
            return [];
        }
        const err = document.querySelector('.error');
        if(err !== null) {
            err.remove();
        }
        const suggestions = JSON.parse(data);
        const input = document.querySelector('.autosuggest-input');
        input.classList.remove('input-error');
        hideSuggestions();
        clearSuggestions();
        const term = input.value;
        const found = suggestions.find(sgg => sgg.title === term);
        if(!found) {
            const error = document.createElement('div');
            error.className = 'error';
            error.innerText = 'You must choose one of the suggested values.';
            document.querySelector('.autosuggest-form').appendChild(error);
            input.classList.add('input-error');
            return false;
        }    
        return true;
    };

    const handleSubmit = () => {
        const btn = document.querySelector('.autosuggest-btn');
        btn.addEventListener('click', () => {
            validateSuggestions();
        }, false);
    };

    const handleInput = () => {
        const input = document.querySelector('.autosuggest-input');
        input.addEventListener('keyup', function() {
            const value = this.value;
            if(value && value.length >= 3 && !/^\s+$/.test(value)) {
                hideSuggestions();
                clearSuggestions();
                const suggestions = getSuggestions(value);
                if(suggestions.length > 0) {
                    for(const sugg of suggestions) {
                        createSuggestion(sugg.title);
                    }
                    showSuggeestions();
                }
            }  else {
                hideSuggestions();
                clearSuggestions();
            }   
        }, false);
    };

    const setData = async () => {
        let data = [];
        try {
            data = await getData();
        } catch(err) {

        }
        sessionStorage.setItem('suggestions', JSON.stringify(data));
    };

    document.addEventListener('DOMContentLoaded', () => {
        (async() => {
            handleSuggestion();
            await setData();
            handleInput();
            handleSubmit();
        })();
    }, false);
})();