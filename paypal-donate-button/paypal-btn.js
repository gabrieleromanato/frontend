'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.id = 'donate-button-container';
    const button = document.createElement('div');
    button.id = 'donate-button';
    container.appendChild(button);
    const script = document.createElement('script');
    script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
    container.appendChild(script);
    script.onload = () => {
      PayPal.Donation.Button({
        env: 'production',
        hosted_button_id: 'HV3GXK2PUQHQN',
        image: {
          src: 'https://www.paypalobjects.com/it_IT/IT/i/btn/btn_donate_LG.gif',
          alt: 'Fai una donazione con il pulsante PayPal',
          title: 'PayPal - The safer, easier way to pay online!',
        },
      }).render('#donate-button');
    };
    document.body.appendChild(container);
  });
})();
