'use strict';

(function() {

    const API_ENDPOINT = 'https://catfact.ninja/facts';

    async function getData(url) {
        try {
            const request = await fetch(url);
            if(!request.ok) {
                throw new Error('Request error.');
            }
            return await request.json();
        } catch(err) {
            return null;
        }
    }

    function createPaginationLinks(previous, next) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        if(previous) {
            const previousBtn = document.createElement('button');
            previousBtn.type = 'button';
            previousBtn.dataset.page = previous;
            previousBtn.innerText = 'Previous';
            previousBtn.id = 'previous';
            previousBtn.className = 'pagination-link';
            pagination.appendChild(previousBtn);
        }
        if(next) {
            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.dataset.page = next;
            nextBtn.innerText = 'Next';
            nextBtn.id = 'next';
            nextBtn.className = 'pagination-link';
            pagination.appendChild(nextBtn);
        }
    }

    async function getFacts(page = 1) {
        const list = document.getElementById('facts-list');
        const preloader = document.getElementById('preloader');
        preloader.classList.remove('loaded');
        try {
            const url = `${API_ENDPOINT}?page=${page}`;
            const facts = await getData(url);
            if(!facts) {
                throw new Error('Request error.');
            }
            const data = facts.data;
            let contents = '';

            for(const fact of data) {
                contents += `<li>${fact.fact}</li>`;
            }
            list.innerHTML = contents;
            createPaginationLinks(facts.prev_page_url, facts.next_page_url);
            preloader.classList.add('loaded');
        } catch(err) {
            preloader.classList.add('loaded');
            list.innerHTML = '<li class="error">No data to show.</li>';
        }
    }

    function handlePagination() {
        document.addEventListener('click', evt => {
            if(evt.target.classList.contains('pagination-link')) {
                const button = evt.target;
                const link = button.dataset.page;
                const page = parseInt(link.split('?')[1].replace('page=', ''), 10);
                getFacts(page);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        handlePagination();
        getFacts();
    });

})();