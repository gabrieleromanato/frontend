'use strict';

class PasswordGenerator {
    constructor({ input = null, createButton = null,
                    copyButton = null, lengthInput = null,
                    lettersControl = null,
                    mixedControl = null,
                    punctControl = null, numberControl = null }) {
        this.letters = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz'
        };
        this.digits = '0123456789';
        this.symbols = '!$%&()=?*+><:;.-@[]{}';

        this.input = input;
        this.createButton = createButton;
        this.copyButton = copyButton;
        this.lengthInput = lengthInput;
        this.lettersControl = lettersControl;
        this.mixedControl = mixedControl;
        this.punctControl = punctControl;
        this.numberControl = numberControl;

        if(this.canInit()) {
            this.init();
        }
    }

    canInit() {
        return this.input && this.createButton && this.copyButton && this.lengthInput && this.lettersControl && this.mixedControl && this.punctControl
                 && this.numberControl;
    }

    build(state) {
        let characters = '';
        if(state.letters) {
            characters += this.getCharacters('lowercase');
        }
        if(state.mixed) {
            characters = this.getCharacters('letters');
        }

        if(state.punctuation) {
            characters += this.getCharacters('symbols');
        }

        if(state.numbers) {
            characters += this.getCharacters('numbers');
        }

        if(characters.length === 0) {
            characters = this.getCharacters();
        }

        return this.shuffle(characters);
    }

    triggerEvent(element, name = 'click') {
        const evt = new Event(name);
        return element.dispatchEvent(evt);
    }

    create(chars, length) {
        let password = '';
        for(let i = 1; i <= length; i++) {
            let char = Math.floor(Math.random() * chars.length + 1);
            password += chars.charAt(char);
        }
        return password;
    }

    shuffle(str) {
        return str.split('').sort((a, b) => { return Math.random() - 0.5; }).join('');
    }

    getControlState() {
        let state = {
            letters: false,
            mixed: false,
            punctuation: false,
            numbers: false
        };

        state.letters = (this.lettersControl.checked);
        state.mixed = (this.mixedControl.checked);
        state.punctuation = (this.punctControl.checked);
        state.numbers = (this.numberControl.checked);

        return state;
    }

    events() {
        const self = this;
        self.createButton.addEventListener('click', evt => {
            evt.preventDefault();
            let state = self.getControlState();
            self.input.value = self.create(self.build(state), parseInt(self.lengthInput.value, 10));
        }, false);


        self.lengthInput.addEventListener('change', () => {
            self.triggerEvent(self.createButton, 'click');
        }, false);

        self.lettersControl.addEventListener('change', () => {
            self.triggerEvent(self.createButton, 'click');
        }, false);


        self.mixedControl.addEventListener('change', () => {
            self.triggerEvent(self.createButton, 'click');
        }, false);

        self.punctControl.addEventListener('change', () => {
            self.triggerEvent(self.createButton, 'click');
        }, false);

        self.numberControl.addEventListener('change', () => {
            self.triggerEvent(self.createButton, 'click');
        }, false);

        self.copyButton.addEventListener('click', evt => {
            evt.preventDefault();
            self.input.select();
            document.execCommand('copy');
            self.copyButton.innerText = 'Copied!';
            setTimeout(() => {
                self.copyButton.innerText = 'Copy Password';
            }, 1000);
        }, false);


        self.triggerEvent(self.createButton, 'click');
    }

    init() {
        this.events();
    }

    getCharacters(kind = 'all') {
        switch(kind) {
            case 'uppercase':
                return this.letters.uppercase;
            case 'lowercase':
                return this.letters.lowercase;
            case 'letters':
                return this.letters.uppercase + this.letters.lowercase;
            case 'symbols':
                return this.symbols;
            case 'numbers':
                return this.digits;
            default:
                return this.letters.uppercase + this.letters.lowercase + this.digits + this.symbols;
        }

    }
}