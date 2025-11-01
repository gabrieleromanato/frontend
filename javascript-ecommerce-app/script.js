'use strict';

(function() {

    class Cart {
        constructor() {
            this.cart = localStorage.getItem('js-ecommerce-app-cart') ? JSON.parse(localStorage.getItem('js-ecommerce-app-cart')) : {
                items: [],
                total: 0.00
            };
            this.counterElement = document.getElementById('app-cart-total-counter');
            this.cartElement = document.getElementById('app-cart-contents');
            this.cartTotal = document.getElementById('app-cart-total');
            this.save();
        }

        add(item) {
            const itemInCart = this.cart.items.find((i) => { return i.id === item.id });
            if(itemInCart) {
                let qty = parseInt(itemInCart.quantity,10);
                qty++;
                return this.update(itemInCart.id, qty);
            }
            this.cart.items.push(item);
            this.total();
            this.save();
        }

        remove(id) {
            const itemIndex = this.cart.items.findIndex((i) => { return i.id === id });
            if(itemIndex !== -1) {
                this.cart.items.splice(itemIndex, 1);
                this.total();
                this.save();
            }
        }

        update(id, quantity) {
            const item = this.cart.items.find((i) => { return i.id === id });
            if(item) {
                item.quantity = parseInt(quantity, 10);
                this.total();
                this.save();
            }
        }

        setPayPalForm() {
            if(this.cart.items.length === 0) {
                return;
            }
            const lines = document.getElementById('app-paypal-form-lines');
            let idx = 0;
            lines.innerHTML = '';
            for(const item of this.cart.items) {
                idx++;
                const line = document.createElement('div');
                const html = `
                    <input type="hidden" name="quantity_${idx}" value="${item.quantity}">
                    <input type="hidden" name="item_name_${idx}" value="${item.id}">
                    <input type="hidden" name="item_number_${idx}" value="SKU ${item.id}">
                    <input type="hidden" name="amount_${idx}" value="${parseFloat(item.price).toFixed(2)}">
                    <input type="hidden" name="shipping_${idx}" value="0.00">
                `;
                line.innerHTML = html;
                lines.appendChild(line);
            }
        }

        display() {
            this.cartElement.innerHTML = '';
            if(this.cart.items.length === 0) {
                this.cartElement.innerHTML = '<li><div>Your cart is empty.</div></li>';
                this.cartElement.parentElement.classList.remove('has-items');
                this.cartTotal.innerText = '$0.00';
                return;
            }
            this.cartElement.parentElement.classList.add('has-items');
            for(const item of this.cart.items) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="cart-remove-line"><button data-id="${item.id}" type="button" class="app-cart-remove">&times;</button></div>
                    <h4>${item.id}</h4>
                    <div class="cart-price-line">
                       <div>$${item.price.toFixed(2)}</div>
                       <div><input data-id="${item.id}" class="app-input-qty cart-app-input-qty" type="number" value="${item.quantity}"></div>
                    </div>
                    <div>$${(item.price * item.quantity).toFixed(2)}</div>
                    
                `;
                this.cartElement.appendChild(li);
            }
            this.cartTotal.innerText = `$${this.cart.total.toFixed(2)}`;
            this.setPayPalForm();
        }

        save() {
           localStorage.setItem('js-ecommerce-app-cart', JSON.stringify(this.cart));
           this.counterElement.innerText = this.cart.items.length;
           this.display(); 
        }

        total() {
            let sum = 0.00;
            if(this.cart.items.length > 0) {
                for(const item of this.cart.items) {
                    const price = parseFloat(item.price);
                    const qty = parseInt(item.quantity, 10);
                    const sub = price * qty;
                    sum += sub;
                }
            }
            this.cart.total = sum;
        }
    }

    function getRandomPrice(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomImage() {
        const images = ['images/1.webp', 'images/2.webp', 'images/3.webp', 'images/4.webp'];
        const sorted = images.sort(() => Math.random() - 0.5);
        return sorted[0];
    }

    function hidePreloader(element = null) {
        if(!element) {
            return;
        }
        element.classList.add('loaded');
    }

    function showPreloader(element = null) {
        if(!element) {
            return;
        }
        element.classList.remove('loaded');
    }

    async function getProductsData(url = 'data.json') {
        try {
            const request = await fetch(url);
            if(!request.ok) {
                throw new Error('Fetch failed');
            }
            return await request.json();
        } catch(err) {
            console.error(err);
            return [];
        }
    }

    function handleAddToCartButton() {
        document.addEventListener('click', (evt) => {
            const cart = new Cart();
            if(evt.target.classList.contains('app-add-to-cart')) {
                const btn = evt.target;
                const item = JSON.parse(btn.parentNode.dataset.item);
                const qty = parseInt(btn.previousElementSibling.value, 10);
                const data = {
                    id: item.id,
                    price: parseFloat(item.price),
                    quantity: qty
                };
                cart.add(data);
            }
        });
    }

    function handleRemoveFromCartButton() {
        document.addEventListener('click', (evt) => {
            const cart = new Cart();
            if(evt.target.classList.contains('app-cart-remove')) {
                const btn = evt.target;
                const id = btn.dataset.id;
                cart.remove(id);
            }
        });
    }

    function handleUpdateCartQtyButton() {
        document.addEventListener('change', (evt) => {
            const cart = new Cart();
            if(evt.target.classList.contains('cart-app-input-qty')) {
                const input = evt.target;
                const id = input.dataset.id;
                const qty = parseInt(input.value, 10);
                cart.update(id, qty);
            }
        });
    }

    function handleShowCartButton() {
        const btn = document.getElementById('app-show-cart');
        const cartElement = document.getElementById('app-cart');

        btn.addEventListener('click', () => {
            cartElement.classList.add('visible');
        });
    }

    function handleHideCartButton() {
        const btn = document.getElementById('close-app-cart');
        const cartElement = document.getElementById('app-cart');

        btn.addEventListener('click', () => {
            cartElement.classList.remove('visible');
        });
    }

    async function displayProducts() {
        const preloader = document.getElementById('preloader');
        const container = document.getElementById('app-products');
        showPreloader(preloader);
        try {
            const products = await getProductsData();
            const items = products.items;
            for(const item of items) {
                const product = document.createElement('article');
                const price = getRandomPrice(100, 300);
                const thumbnail = getRandomImage();
                const productItem = {id: item.model, price: price.toFixed(2) };
                const productItemData = `data-item='${JSON.stringify(productItem)}'`
                product.className = 'app-product';
                product.innerHTML = `
                    <header>
                        <h2>${item.model}</h2>
                        <div>${item.brand}</div>
                    </header>
                    <figure><img src="${thumbnail}"></figure>
                    <footer>
                        <div>$${price.toFixed(2)}</div>
                        <form ${productItemData}>
                            <input name="qty" type="number" class="app-input-qty" value="1">
                            <button type="button" class="app-add-to-cart">Add to cart</button>
                        </form>
                        
                    </footer>
                `;
                container.appendChild(product);
            }
        } catch(err) {
            console.error(err);
        } finally {
            hidePreloader(preloader);
        }
    }

    function init() {
        const cart = new Cart();
        handleAddToCartButton();
        handleRemoveFromCartButton();
        handleUpdateCartQtyButton();
        handleShowCartButton();
        handleHideCartButton();
        displayProducts();
    }

    document.addEventListener('DOMContentLoaded', () => {
        init();
    });

})();