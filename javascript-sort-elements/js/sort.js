'use strict';

class Sorter {
    constructor({ wrapper, sorters, elements, skipIndex, dataMap, keyMap }) {
        this.wrapper = wrapper;
        this.sorters = sorters;
        this.elements = elements;
        this.skipIndex = skipIndex;
        this.dataMap =  dataMap;
        this.keyMap =   keyMap;

        this.setUpElements();
        this.sort();
    }

    setDataType(element, type, key) {
        let text = element.innerText;
        let value = text;
        switch (type) {
            case 'date':
               value = Date.parse(text);
               break;
            case 'float':
                value = value.replace(/[^0-9\.]+/g, '');
                break;
            default:
                break;
        }
        element.parentNode.setAttribute('data-' + key, value);
    }

    sort() {
        const self = this;
        self.sorters.forEach(srtr => {
            let ascBtn = srtr.querySelector('[data-sort="asc"]');
            let descBtn = srtr.querySelector('[data-sort="desc"]');

            ascBtn.addEventListener('click', e => {
                e.preventDefault();
                self.sortElements(self.wrapper.querySelectorAll('tbody tr'), ascBtn.dataset.sort, ascBtn.parentNode.dataset.key, ascBtn.parentNode.dataset.type);
            }, false);

            descBtn.addEventListener('click', e => {
                e.preventDefault();
                self.sortElements(self.wrapper.querySelectorAll('tbody tr'), descBtn.dataset.sort, descBtn.parentNode.dataset.key, descBtn.parentNode.dataset.type);
            }, false);
        });
    }

    setUpElements() {
        const self = this;
        if(this.elements.length === 0) {
            return false;
        }
        self.sorters.forEach((sorter, i) => {
           sorter.setAttribute('data-type', self.dataMap[i]);
           sorter.setAttribute('data-key', self.keyMap[i]);
        });
        self.elements.forEach(element => {
            element.querySelectorAll('td').forEach((cell, index) => {
                if(index > self.skipIndex) {
                    cell.classList.add('sortable');
                }
            });
            element.querySelectorAll('.sortable').forEach((sortable, ind) => {
               self.setDataType(sortable, self.dataMap[ind], self.keyMap[ind]);
            });
        });
    }

    sortElements(elements, order, key, type) {
        const comparator = (a, b) => {
            let v1 = a.dataset[key];
            let v2 = b.dataset[key];

            if(type === 'integer' || type === 'date') {
                v1 = parseInt(v1, 10);
                v2 = parseInt(v2, 10);
            }

            if(type === 'float') {
                v1 = parseFloat(v1);
                v2 = parseFloat(v2);
            }

            if(order === 'asc') {
                return v1 - v2;
            } else {
                return v2 - v1;
            }
        };
        const items = Array.from(elements);
        const sorted = items.sort(comparator);

        sorted.forEach(el => {
           el.parentNode.appendChild(el);
        });
    }

}