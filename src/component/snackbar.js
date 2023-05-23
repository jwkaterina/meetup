import html from './snack-bar.hbs';

export class Snackbar extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = html();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    show(text) {
        this.shadowRoot.querySelector(".snackbar").classList.add("show");
        this.shadowRoot.querySelector('h3').innerText = text;

        setTimeout(() => { 
            this.shadowRoot.querySelector(".snackbar").classList.remove("show"); 
        }, 3000);
    }
}

window.customElements.get('snack-bar') || window.customElements.define('snack-bar', Snackbar);


