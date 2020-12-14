'use strict'

class Virtual_keyboard {

    constructor () {
        this.elements = {};
        //this.elements.main = null;
        this.elements.main = 5;
        this.elements.keysContainer = null;
        this.elements.keys = [];

        this.eventHandlers = {};
        this.eventHandlers.oninput = null;
        this.eventHandlers.onclose  = null;

        this.properties = {};
        this.eventHandlers.value = '';
        this.eventHandlers.capsLock = false;
    }

    init () {

        //create main elements
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        //setup main elements
        this.elements.main.classList.add('keyboard', 'keyboard__hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
    };

    _createKeys () {
        const fragment = document.createDocumentFragment();
        const keyLayout = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Backspace",
                            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
                            "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter",
                            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
                            "space"];

        //create html for an icon
        const createIconHtml = (icon_name) => {
            return `<svg class="bi" width="32" height="32" fill="currentColor">
                        <use xlink:href="css/bootstrap-icons.svg#${icon_name}"/>
                    </svg>`
        }

        keyLayout.forEach(key => {

            const keyElement =  document.createElement('button');
            const insertLineBreak = ['backspace', 'p', 'enter', '?', ].indexOf(key) !== -1;

            //add classes

            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key) {
                case 'Backspace':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml ('backspace-fill');

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.substring (0, this.properties.value.length - 1);
                    this._triggerEvent('oninput');

                    })

                    break;

                case 'CapsLock':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activalable');
                    keyElement.innerHTML = createIconHtml ('capslock-fill');

                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock ();
                        keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock)

                    })

                    break;

                case 'Enter':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml ('arrow-return-left');

                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n';
                        this._triggerEvent('oninput');

                    })

                    break;

                case 'space':
                    keyElement.classList.add('keyboard__key--extra-wide');
                    keyElement.innerHTML = createIconHtml ('keyboard');

                    keyElement.addEventListener('click', () => {
                        this.properties.value += ' ';
                        this._triggerEvent('oninput');

                    })

                    break;

                case 'done':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml ('check-circle');

                    keyElement.addEventListener('click', () => {
                        this.close ();
                        this._triggerEvent('onclose');

                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent('oninput');
                    });

                    break;
            }
        })
    };

    _triggerEvent (handlerName) {
        console.log(`Event triggered! Event Name ${handlerName}`);
    };

    _toggleCapsLock (handlerName) {
        console.log(`CapsLock Toggled `);
    };

    open (initialValue, oninput, onclose) {

    };

    close () {

    };

    /* check_method () {
        console.log (`check ${this.elements.main} element`);
        console.log (`check ${this.elements.keysContainer} element`);
        console.log (`check ${this.elements.keys} element`);
    } */
}

window.addEventListener ('DOMContentLoaded', () => {
    
    v_keyboard.init()
})

let v_keyboard = new Virtual_keyboard ();

//v_keyboard.check_method();