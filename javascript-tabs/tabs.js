'use strict';

(function () {
    class Tabs {
        constructor() {
            this.tabs = document.querySelectorAll('.tabs');
            if(this.tabs.length > 0) {
                this.init();
            }
        }

        init() {
            this.navigation();
            this.hash();
        }

        hash() {
            window.addEventListener('hashchange', () => {
                const link = document.querySelector('a[href="' + location.hash + '"]');
                if(link !== null) {
                    const click = new Event('click');
                    link.dispatchEvent(click);
                }
            }, false);
        }

        navigation() {
            this.tabs.forEach(tab =>  {
                let nav = tab.querySelector('.tabs-nav');
                let navItems = nav.querySelectorAll('a');
                let content = tab.querySelector('.tabs-content');

                navItems.forEach(item => {
                   item.addEventListener('click', evt => {
                       evt.preventDefault();
                       let curItem = item.parentNode;
                       let targetSelector = /^#/.test(item.getAttribute('href')) ? item.getAttribute('href') : '#' + item.getAttribute('href');
                       let targetElement =  document.querySelector(targetSelector);
                       nav.querySelectorAll('.tabs-nav-item').forEach(it => {
                            it.classList.remove('tabs-nav-item-active');
                       });
                       curItem.classList.add('tabs-nav-item-active');
                       content.querySelectorAll('.tab').forEach(tb => {
                          tb.classList.remove('tab-active');
                       });

                       if(targetElement !== null) {
                           targetElement.classList.add('tab-active');
                       }

                   }, false);
                });
            });

        }
    }

    window.Tabs = new Tabs();
})();