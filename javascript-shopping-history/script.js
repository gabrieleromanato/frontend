'use strict';

(function() {
    let shoppingHistory = [];

    function createShoppingHistory() {
        const shoppingHist = localStorage.getItem('js-shopping-history');
        if(shoppingHist) {
            shoppingHistory = JSON.parse(shoppingHist);
        } else {
            localStorage.setItem('js-shopping-history', JSON.stringify(shoppingHistory));
        }
    }

    function getShoppingHistory() {
        const shoppingHist = localStorage.getItem('js-shopping-history');
        return shoppingHist ? JSON.parse(shoppingHist) : [];
    }

    function displayShoppingHistory() {
        const historyList = getShoppingHistory();
        const header = document.getElementById('app-header');
        if(historyList.length === 0) {
            return;
        }
        header.classList.add('visible');   
        const list = document.getElementById('shopping-history-list');
        let html = '';
        for(const item of historyList) {
            html += `<li><a href="single.html?id=${item.id}"><img src="images/${item.image}" alt="${item.name}"></a></li>`;
        }
        list.innerHTML = html;
    }

    function toggleShoppingHistory() {
        const toggle = document.getElementById('shopping-history-toggle');
        const list = document.getElementById('shopping-history-list');

        toggle.addEventListener('click', () => {
            list.classList.toggle('visible');
        }, false);
    }

    function alreadyInShoppingHistory(id) {
        const shoppingHist = getShoppingHistory();
        const product = shoppingHist.find(p => parseInt(p.id, 10) === parseInt(id, 10));
        return product ? true : false;   
    }

    async function getData(url = '') {
        const request = await fetch(url);
        return await request.json();
    }

    async function setHomeView(app) {
        const items = await getData('all-products.json');
        const row = document.createElement('div');
        row.className = 'row';
        const itemsToShow = items.slice(0, 9);
        for(const item of itemsToShow) {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-3';
            col.innerHTML = `
                <div class="card">
                    <figure><img src="images/${item.image}" alt="${item.name}"></figure>
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                    </div>
                    <div class="card-footer">
                        <a href="single.html?id=${item.id}" class="btn btn-primary">View</a>
                    </div>
                </div>
            `;
            row.appendChild(col);
        } 
        app.innerHTML = row.outerHTML;   
    }

    async function setSingleView(app) {
        const urlQuery = location.search;
        if(!urlQuery) {
            return setHomeView(app);
        }
        const items = await getData('all-products.json');
        
        const pathParts = new URLSearchParams(urlQuery);
        const itemId = parseInt(pathParts.get('id'), 10);
        const item = items.find(i => i.id === itemId);
        if(!item) {
            return;
        } 
        document.title = `${item.name} | JavaScript Shopping History`;
        let rating = '<div class="mt-3 mb-3 d-flex align-items-center">';
        for(let i = 0; i < item.rating; i++) {
            rating += '<i class="fa-solid fa-star pe-2"></i>';
        }  
        rating += '</div>';
        const wrapper = document.createElement('div');
        wrapper.className = 'p-3';
        wrapper.innerHTML = `
            <h1 class="fw-bold">${item.name}</h1>
            ${rating}
            <div class="row mt-3">
                <figure class="col-md-5">
                    <img src="images/${item.image}" alt="${item.name}" class="img-fluid">
                </figure>
                <article class="col-md-7">
                    <div class="text-muted h4">$${item.price}</div>
                    <p class="lead mt-3">${item.description}</p>
                    <a href="index.html" class="btn btn-secondary mt-3 back-home">Back to Home</a>
                </article>
            </div>
        `;

        app.innerHTML = wrapper.outerHTML;
        if(!alreadyInShoppingHistory(itemId)) {
            const shopHist = getShoppingHistory();
            shopHist.push(item);
            localStorage.setItem('js-shopping-history', JSON.stringify(shopHist));
            displayShoppingHistory();
        }

    }

    function init() {
        const app = document.getElementById('app');
        createShoppingHistory();
        toggleShoppingHistory();
        displayShoppingHistory();
        setHomeView(app);
        setSingleView(app);
    }

    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
})();