'use strict';

(function () {
    class SocialShare {
        constructor(options) {
            const defaults = {
                cssIconsPath: 'css/fontawesome/css/all.css',
                cssPath: 'css/social-share.css',
                hideOnMobile: true,
                elementID: 'social-share',
                parentElement: document.body,
                buttons: [
                    {
                        name: 'Facebook',
                        icon: 'fab fa-facebook-f',
                        cssClass: 'social-share-facebook',
                        url: location.href,
                        text: '',
                        shareURL: 'https://www.facebook.com/sharer.php?u={url}',
                        styles: null
                    },
                    {
                        name: 'Twitter',
                        icon: 'fab fa-twitter',
                        cssClass: 'social-share-twitter',
                        url: location.href,
                        text: document.title,
                        shareURL: 'https://twitter.com/intent/tweet?text={text} {url}',
                        styles: null
                    },
                    {
                        name: 'Linkedin',
                        icon: 'fab fa-linkedin-in',
                        cssClass: 'social-share-linkedin',
                        url: location.href,
                        text: document.title,
                        shareURL: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={text}&source=LinkedIn',
                        styles: null
                    }
                ],
                position: 'left',
                display: 'vertical'
            };

            this.options = Object.assign(defaults, options);
            this.element = null;
            this.styleElement = null;
            this.init();
        }

        init() {
            this.create();
        }

        create() {
            this.element = document.createElement('ul');
            this.element.id = this.options.elementID;
            this.options.parentElement.appendChild(this.element);

            this.element.classList.add(this.options.position);
            this.element.classList.add(this.options.display);
            this.addStyles(this.element);
            this.addButtons();

            if(this.options.hideOnMobile) {
                if(/mobile/gi.test(navigator.userAgent)) {
                    this.element.style.display = 'none';
                }
            }
        }

        addStyles(target) {
            const baseURL = location.protocol + '//' + location.host + '/';
            const iconsURL = baseURL + this.options.cssIconsPath;
            const cssURL = baseURL + this.options.cssPath;

            this.styleElement = document.createElement('style');
            this.styleElement.id = this.options.elementID + '-css';
            this.styleElement.innerText = `@import url(${iconsURL}); @import url(${cssURL});`;

            target.before(this.styleElement);
        }

        addButton(button) {
            this.options.buttons.push(button);
            this.redraw();
        }

        addButtons() {
            if (Array.isArray(this.options.buttons) && this.options.buttons.length > 0) {
                this.options.buttons.forEach(button => {
                    let item = document.createElement('li');
                    let link = document.createElement('a');

                    link.className = button.cssClass;
                    link.title = button.name;
                    link.href = button.text.length > 0 ?
                        button.shareURL.replace('{url}', button.url).replace('{text}', encodeURIComponent(button.text))
                        : button.shareURL.replace('{url}', button.url);
                    link.innerHTML = `<i class="${button.icon}"></i>`;

                    if(button.styles !== null) {
                        for(let prop in button.styles) {
                            link.style[prop] = button.styles[prop];
                        }
                    }

                    link.addEventListener('click', e => {
                        e.preventDefault();
                        let url = link.href;
                        let width = 550;
                        let height = 450;
                        let left = (screen.width - width) / 2;
                        let top = (screen.height - height) / 2;

                        let newWindow = window.open(url, '', 'scrollbars=1, width=' + width + ', height=' + height + ', left=' + left + ', top=' + top);

                        if (newWindow.focus) {
                            newWindow.focus();
                        }
                    }, false);

                    item.appendChild(link);
                    this.element.appendChild(item);
                });
            }
        }

        setOption(name, value) {
            if(name in this.options) {
                this.options[name] = value;
                this.redraw();
            }
        }

        redraw() {
            this.element.remove();
            this.styleElement.remove();
            this.create();
        }
    }

    window.SocialShare = SocialShare;
})();