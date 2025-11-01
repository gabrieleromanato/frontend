'use strict';

const socialShare = new SocialShare({
    cssIconsPath: 'demo/javascript-social-share/css/fontawesome/css/all.css',
    cssPath: 'demo/javascript-social-share/css/social-share.css'
});

const demoSelect = document.querySelector('#position');
const demoAddBtn = document.querySelector('#add-button');

demoSelect.addEventListener('change', () => {
    let position = demoSelect.options[demoSelect.selectedIndex].value;
    socialShare.setOption('position', position);
}, false);

demoAddBtn.addEventListener('click', e => {
    e.preventDefault();
    const newSocialButton = {
        name: 'Pinterest',
        icon: 'fab fa-pinterest-p',
        cssClass: 'social-share-pinterest',
        url: location.href,
        text: document.title,
        shareURL: 'https://pinterest.com/pin/create/button/?url={url}&description={text}',
        styles: {
            backgroundColor: '#cd1c1f'
        }
    };
    socialShare.addButton(newSocialButton);
}, false);