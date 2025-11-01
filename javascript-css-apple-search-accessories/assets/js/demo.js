'use strict';

(function() {

    const TRANSITION_DELAY_MS = 400;

    const getProducts = async () => {
        const req = await fetch('assets/data/products.json');
        return await req.json();
    };

    const toggleSearchResetBtn = (show = true ) => {
        const btn = document.getElementById('term-cancel');
        if(show) {
            btn.style.display = 'block';
            btn.style.opacity = 1;
        } else {
            btn.style.opacity = 0;
            setTimeout(() => {
                btn.style.display = 'none';
            }, TRANSITION_DELAY_MS);
        }
    };

    const handleSearchFocus = () => {
        const overlay = document.getElementById('overlay');
        const input = document.getElementById('term');

        input.addEventListener('focus', () => {
            overlay.style.display = 'block';
            overlay.style.opacity = 1;
        }, false);

        input.addEventListener('blur', () => {
            overlay.style.opacity = 0;
            setTimeout( () => {
                overlay.style.display = 'none';
            }, TRANSITION_DELAY_MS);
            toggleSearchResetBtn(false);
        }, false);
    };


    const handleSearchResetBtn = () => {
        const btn = document.getElementById('term-cancel');
        const suggestions = document.getElementById('suggestions');
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).value = '';
            suggestions.style.display = 'none';
            suggestions.innerHTML = '';
            toggleSearchResetBtn(false);
        }, false);
    };

    const filterSearchResults = (value, results) => {
        return results.filter(res => res.title.toLowerCase().includes(value.toLowerCase())).map(r => r.title);
    };

    

    const handleSearchSuggestions = () => {
        const input = document.getElementById('term');
        const suggestions = document.getElementById('suggestions');
        
        input.addEventListener('keyup', function() {
            const value = this.value;
            suggestions.style.display = 'none';
            suggestions.innerHTML = '';
            if(value.length >= 3 && !/^\s+$/.test(value)) {
                toggleSearchResetBtn();
                getProducts().then(resp => {
                    const { products } = resp;
                    const results = filterSearchResults(value, products);
                    if(results.length > 0) {
                        let html = '';
                        for(const result of results) {
                            html += `<div class="suggestion"><span>${result}</span></div>`;
                        }
                        suggestions.innerHTML = html;
                        suggestions.style.display = 'block';
                    }
                });
            }
        }, false);
    };

    document.addEventListener('DOMContentLoaded', () => {
        handleSearchResetBtn();
        handleSearchFocus();
        handleSearchSuggestions();
    }, false);
})();