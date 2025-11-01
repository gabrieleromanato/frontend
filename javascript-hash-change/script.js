'use strict';

(function() {
    async function getData(url = '') {
        const request = await fetch(url);
        return await request.json();
    }

    async function setHomeView(app) {
        document.title = 'JavaScript Hash Change';
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
                        <a href="#/products/${item.id}" class="btn btn-primary">View</a>
                    </div>
                </div>
            `;
            row.appendChild(col);
        } 
        app.innerHTML = row.outerHTML;   
    }

    async function setSingleView(app) {
        const urlHash = location.hash;
        if(!urlHash) {
            return setHomeView(app);
        }
        const items = await getData('all-products.json');
        
        const pathParts = urlHash.split('/');
        const itemId = parseInt(pathParts[pathParts.length -1], 10);
        const item = items.find(i => i.id === itemId);
        if(!item) {
            return;
        } 
        document.title = `${item.name} | JavaScript Hash Change`;
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
                    <button class="btn btn-secondary mt-3 back-home">Back to Home</button>
                </article>
            </div>
        `;

        app.innerHTML = wrapper.outerHTML;

    }

    function handleHashChange(app) {
        window.addEventListener('hashchange', evt => {
            setSingleView(app);
        });
    }

    function handleNavigation(app) {
        document.addEventListener('click', evt => {
            const element = evt.target;
            if(element.classList.contains('back-home')) {
                setHomeView(app);
                const baseURL = location.href.replace(/#.*$/, '');
                history.replaceState('', document.title, baseURL) 
            }
        }, false);
    }

    function init() {
        const app = document.getElementById('app');
        setHomeView(app);
        setSingleView(app);
        handleNavigation(app);
        handleHashChange(app);
    }

    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
})();