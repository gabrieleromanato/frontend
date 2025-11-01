'use strict';

(function() {

    const getData = async (limit = 24) => {
        try {
            const res = await fetch(`https://dummyjson.com/products/?limit=${limit}`);
            return await res.json();
        } catch(err) {
            return [];
        }
    };

    const isMobile = () => /mobile/gi.test(navigator.userAgent);

    const getViewportWidth = () => {
        return (window.innerWidth || document.documentElement.clientWidth);    
    };

    const preloadImage = src => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve({src, status: true});
            image.onerror = () => reject({src, status: false});
            image.src = src;
        });
    };

    const isInViewport = element => {
        if(element === null || !element) {
            return false;
        }
        const rect = element.getBoundingClientRect();
        return (rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
    };

    const slideTo = (element = null, offset = 0, delay = 400) => {
        return new Promise(( resolve, reject ) => {
            if(element === null) {
                reject(false);
            }
            const sign = offset === 0 ? '' : '-';
            const rule = `translateX(${sign}${offset}px)`;
            element.style.transform = rule;
            setTimeout(() => {
                resolve(true);
            }, delay);
        });
        
    };
    
    class Carousel {
        constructor(settings = {}) {
            const defaults = {
                container: '.carousel',
                previousBtn: '.carousel-prev',
                nextBtn: '.carousel-next',
                wrapper: '.carousel-wrap',
                item: '.carousel-item',
                overlay: '#carousel-overlay',
                overlayClose: '#carousel-overlay-close',
                overlayProduct: '#carousel-overlay-product'
            };
            this.options = Object.assign(defaults, settings);
            this.container = document.querySelector(this.options.container);
            this.previousBtn = this.container.querySelector(this.options.previousBtn);
            this.nextBtn = this.container.querySelector(this.options.nextBtn);
            this.wrapper = this.container.querySelector(this.options.wrapper);
            this.items = this.container.querySelectorAll(this.options.item);
            this.loader = document.getElementById('loader');
            this.overlay = document.querySelector(this.options.overlay);
            this.overlayClose = document.querySelector(this.options.overlayClose);
            this.overlayProduct = document.querySelector(this.options.overlayProduct);
            this.pages = 0;
            this.index = 0;
            this.images = [];

            if(this.container !== null) {
                this.init();
            }
        }

        init() {
            this.setVisibleItems();
            this.setPages();
            this.handleHideOverlay();
            this.onResize();
            this.next();
            this.previous();
            this.getDataItems();
        }

        showOverlay() {
            this.overlay.style.display = 'block';
            this.overlay.style.opacity = 1;
        }

        hideOverlay() {
            this.overlay.style.opacity = 0;
            setTimeout(() => {
                this.overlay.style.display = 'none';
            }, 400);
        }

        handleHideOverlay() {
            this.overlayClose.addEventListener('click', e => {
                e.preventDefault();
                this.hideOverlay();
            }, false);
            this.overlay.addEventListener('click', evt => {
                const targetElement = evt.target;
                if(targetElement.matches(this.options.overlay)) {
                    const click = new Event('click');
                    this.overlayClose.dispatchEvent(click);
                }
            }, false);
        }

        handleItemsClick() {
            for(const item of this.items) {
                item.addEventListener('click', () => {
                    const title = item.querySelector('.carousel-title');
                    const img = item.querySelector('img');
                    const childs = title.querySelectorAll('span');
                    const price = childs[1].innerHTML;
                    let content = `<figure><img src="${img.dataset.main}"></figure>`;
                    content += `<div class="carousel-product-details"><span>${price}</span><button>Buy Product</button></div>`;
                    this.overlayProduct.innerHTML = content;
                    this.showOverlay();
                }, false);
            }
        }

        setDataItems(data) {
            if(!Array.isArray(data.products) || data.products.length === 0) {
                return false;
            }
            const { products } = data;
            this.items.forEach((item, index) => {
                let caption = document.createElement('div');
                caption.className = 'carousel-caption';
                let product = products[index];
                let { title, description, thumbnail, images, price } = product;
                let displayPrice = price.toFixed(2).replace('.', ',');
                this.images.push({thumbnail, image: images.length > 0 ? images[0] : thumbnail });
                caption.innerHTML = `<span class="carousel-title"><span>${title}</span> <span>&euro;${displayPrice}</span></span><span class="carousel-desc">${description}</span>`;
                item.appendChild(caption);
            });
        }

        preloadImages() {
            if(this.images.length === 0) {
                return false;
            }
            const tasks = [];
            for(const img of this.images) {
                let { thumbnail, image } = img;
                tasks.push(preloadImage(thumbnail));
                tasks.push(preloadImage(image));
            }
            return Promise.all(tasks);
        }

        setItemImages() {
            if(this.images.length === 0) {
                return false;
            }
            this.items.forEach((item, index) => {
                let src = typeof this.images[index] === 'object' ? this.images[index] : null;
                if(src !== null) {
                    let img = item.querySelector('img');
                    img.setAttribute('src', src.thumbnail);
                    img.setAttribute('data-main', src.image);
                }
            });
        }

        hideLoader() {
            this.loader.style.opacity = 0;
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 400);
        }

        getDataItems() {
            const self = this;
            getData().then(items => {
                self.setDataItems(items);
                self.preloadImages().then(srcs => {
                    self.handleItemsClick();
                    self.setItemImages();
                    self.hideLoader();
                }).catch(e => {
                    self.hideLoader();
                });
            }).catch(err => console.log(err));
        }

        getOffset(index, width) {
            return Math.round(index * width);
        }

        setPages() {
            this.pages = this.getPages();
        }

        getPages() {
            const visibles = this.container.querySelectorAll('.carousel-item-visible');
            if(visibles.length === 0) {
                return this.items.length;
            }    
            return Math.floor(this.items.length / visibles.length);
        }

        next() {
            const self = this;
            self.nextBtn.addEventListener('click', () => {
                const pageWidth = self.getVisibleItemsWidth();
                self.index++;
                if(self.index > self.pages) {
                    self.index = 1;
                }
                slideTo(self.wrapper, self.getOffset(self.index,pageWidth)).then(() => {
                    self.setVisibleItems();
                });
            }, false);
        }

        previous() {
           const self = this;
           self.previousBtn.addEventListener('click', () => {
                const pageWidth = self.getVisibleItemsWidth();
                self.index--;
                if(self.index <= 0) {
                    self.index = 0;
                }
                slideTo(self.wrapper, self.getOffset(self.index,pageWidth)).then(() => {
                    self.setVisibleItems();
                });
            }, false); 
        }

        onResize() {
            window.addEventListener('resize', () => {
                this.setVisibleItems();
                this.setPages();
            }, false);
        }

        getVisibleItemsWidth() {
            if(isMobile() && getViewportWidth() <= 768) {
                const item = this.items[0];
                const rectItem = item.getBoundingClientRect();
                return Math.round(rectItem.width);
            }
            const visibles = this.container.querySelectorAll('.carousel-item-visible');
            if(visibles.length === 0) {
                return 0;
            } 
            let width = 0; 
            for(const visible of visibles) {
                const rect = visible.getBoundingClientRect();
                width += rect.width;
            }
            return Math.round(width);  
        }

        resetVisibleItems() {
            const visibles = this.container.querySelectorAll('.carousel-item-visible');
            if(visibles.length === 0) {
                return false;
            }
            for(const visible of visibles) {
                visible.classList.remove('carousel-item-visible');
            }
        }

        setVisibleItems() {
            if(isMobile() && getViewportWidth() <= 768) {
                return false;
            }
            this.resetVisibleItems();
            for(const item of this.items) {
                if(isInViewport(item)) {
                    item.classList.add('carousel-item-visible');
                }
            }
        }
    }

    window.Carousel = Carousel;
})();