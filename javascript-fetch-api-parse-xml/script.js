'use strict';

(function() {
    async function getXMLFile(url = 'feed.xml') {
        try {
            const response = await fetch(url);
            if(!response.ok) {
                throw new Error(response.statusText);
            }
            const text = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'text/xml');
            return xml;
        } catch(err) {
            return null;
        }
    }

    async function parseXMLFeed(url = 'feed.xml') {
        const xmlDocument = await getXMLFile(url);
        if(!xmlDocument) return;
        const items = xmlDocument.getElementsByTagName('item');
        const feed = document.querySelector('.feed');
        const list = document.createElement('ul');

        let html = [];

        for(let i = 0; i < items.length; i++) {
            let item = items[i];
            let title = item.querySelector('title').firstChild.nodeValue;
            let link = item.querySelector('link').firstChild.nodeValue;
            let description = item.querySelector('description').firstChild.nodeValue;

            html.push(`<li><a href="${link}">${title}</a><p>${description}</p></li>`);
        }

        list.innerHTML = html.join('');
        feed.appendChild(list);
    }

    document.addEventListener('DOMContentLoaded', () => {
        parseXMLFeed();
    });
})();