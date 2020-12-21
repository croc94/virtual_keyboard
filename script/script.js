'use strict'

class Virtual_keyboard {

    constructor () {
        this.elements = {};
        this.elements.main = null;
        this.elements.keysContainer = null;
        this.elements.keys = [];

        this.eventHandlers = {};
        this.eventHandlers.oninput = null;
        this.eventHandlers.onclose  = null;

        this.properties = {};
        this.properties.value = '';
        this.properties.capsLock = false;
    }

    init () {

        //create main elements
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        //setup main elements(add classes to main elements)
        this.elements.main.classList.add('keyboard', 'keyboard__hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys());


        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        //add to dom
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        //autmaticly use keyboard for elements with .use-keyboard-input
        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });

                

                //key press events for buttons
                window.addEventListener('keydown', (eventPress) => {

                    //when keuboard block isn't hidden, listen keyboard events
                    if (!document.querySelector('.keyboard').classList.contains('keyboard__hidden')) {

                        eventPress.stopPropagation();
                        eventPress.preventDefault();

                        this.elements.keys.forEach(item => {

                            if (item.getAttribute('data-key') === eventPress.key) {
                                item.classList.add('keyboard__key--press');
                            };
                        });

                        switch (eventPress.key) {
                            case 'Backspace':

                                this.properties.value = this.properties.value.substring (0, this.properties.value.length - 1);
                                this._triggerEvent('oninput');

                                break;
            
                            case 'CapsLock':
            
                                this._toggleCapsLock ();
                                this.elements.keys.forEach(elem =>{
                                    if (elem.getAttribute('data-key') === 'CapsLock') {
                                        elem.classList.toggle('keyboard__key--active', this.properties.capsLock);
                                    }
                                }) 
            
                                break;
            
                            case 'Enter':

                                this.properties.value += '\n';
                                this._triggerEvent('oninput');
            
                                break;
            
                            case 'space':

                                this.properties.value += ' ';
                                this._triggerEvent('oninput');
            
                                break;
            
                            case 'done':

                                this.close ();
                                this._triggerEvent('onclose');
            
                                break;
            
                            default:

                                this.properties.value += this.properties.capsLock ? eventPress.key.toUpperCase() : eventPress.key.toLowerCase();
                                this._triggerEvent('oninput');
            
                                break;
                        }
                        
                    }
                })

                //key up events for buttons
                window.addEventListener('keyup', (eventPress) => {

                    //when keuboard block isn't hidden, listen keyboard events
                    if (!document.querySelector('.keyboard').classList.contains('keyboard__hidden')) {

                        eventPress.stopPropagation();
                        eventPress.preventDefault();

                        this.elements.keys.forEach(item => {

                            if (item.getAttribute('data-key') === eventPress.key) {
                                item.classList.remove('keyboard__key--press');
                            };
                        });
                    }
                })
            })
        });
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
            const insertLineBreak = ['Backspace', 'p', 'Enter', '?', ].indexOf(key) !== -1;

            //add classes

            keyElement.setAttribute('type', 'button');
            keyElement.setAttribute('data-key', key);
            keyElement.classList.add('keyboard__key');

            switch (key) {
                case 'Backspace':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml ('backspace-fill');

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring (0, this.properties.value.length - 1);
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

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;
    };

    _triggerEvent (handlerName) {

        if (typeof this.eventHandlers[handlerName] == 'function') {

            this.eventHandlers[handlerName](this.properties.value);
        }
    };

    _toggleCapsLock (handlerName) {
        this.properties.capsLock = !this.properties.capsLock;

        for(const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    };

    open (initialValue, oninput, onclose) {

        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard__hidden');

    };

    close () {

        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard__hidden')
        
    };
}

window.addEventListener ('DOMContentLoaded', () => {
    
    v_keyboard.init();
})

let v_keyboard = new Virtual_keyboard ();