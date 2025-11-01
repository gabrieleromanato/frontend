'use strict';

(function() {
    function setUpslider(container = null) {
        if(!container) {
            return;
        }
        const widthFactor = 12;
        const baseWidth = container.offsetWidth;
        const slides = container.querySelectorAll('li');
        for(const slide of slides) {
            slide.style.width = `${baseWidth}px`;
        }
        container.querySelector('.slider-wrapper').style.minWidth = `${baseWidth * widthFactor}px`;
        const sliderNav = document.createElement('nav');
        sliderNav.className = 'slider-nav';
        for(let i = 0; i < slides.length; i++) {
            let btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.slide = i;
            btn.innerHTML = `<span>${i+1}</span>`;
            sliderNav.appendChild(btn);
        }
        container.appendChild(sliderNav);
    }

    function handleActiveButton(container, btn) {
        if(!container) {
            return;
        }
        const nav = container.querySelector('.slider-nav');
        if(!nav) {
            return;
        } 
        const buttons = nav.querySelectorAll('button');
        for(const button of buttons) {
            button.classList.remove('active');
        }
        btn.classList.add('active');

    }

    function handleInfiniteScroll(container, index) {
        if(!container) {
            return;
        }
        const slides = container.querySelectorAll('li');
        if((index + 1) === slides.length) {
            for(const slide of slides) {
                const copy = slide.cloneNode(true);
                copy.classList.add('cloned');
                slide.parentNode.appendChild(copy);
            }
            const cloned = container.querySelectorAll('.cloned');
            for(const clone of cloned) {
                clone.style.width = `${container.offsetWidth}px`;
            }
            const buttons = container.querySelectorAll('.slider-nav button');
            let start = parseInt(buttons[buttons.length - 1].dataset.slide, 10);
            for(const button of buttons) {
                start++;
                button.dataset.slide = start;
            }
        }
    }

    function handleSliderNavigation(container = null) {
        if(!container) {
            return;
        }
        const nav = container.querySelector('.slider-nav');
        if(!nav) {
            return;
        }
        const buttons = nav.querySelectorAll('button');
        const wrapper = container.querySelector('.slider-wrapper');
        

        for(const button of buttons) {
            button.addEventListener('click', () => {
                const slides = wrapper.querySelectorAll('li');
                const idx = parseInt(button.dataset.slide, 10);
                const slide = slides[idx];
                if(slide) {
                    const left = slide.offsetLeft;
                    const rule = `translateX(-${left}px)`;
                    wrapper.style.transform = 'translateX(0)';
                    wrapper.style.transform = rule;
                    handleActiveButton(container, button);
                    handleInfiniteScroll(container, idx);
                    
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const slider = document.querySelector('.slider');
        setUpslider(slider);
        handleSliderNavigation(slider);
    });
})();