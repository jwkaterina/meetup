import html from './event-slot.hbs';

class EventSlot extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = html();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector('.event-img').src = this.getAttribute('imgsrc');
    }

    setNumber() {
        this.shadowRoot.querySelector('.event-number').innerText = this.getAttribute('number');
    }

    setImage() {
        this.shadowRoot.querySelector('.event-img').src = this.getAttribute('imgsrc');
        this.shadowRoot.querySelector('.event-img').style.height = this.getAttribute('height');
    }

    setText() {
        this.shadowRoot.querySelector('.event-text').innerText = this.getAttribute('text');
    }

    setColor(isCurrent) {
        if(isCurrent === true) {
            this.shadowRoot.querySelector('.event').style.background = "var(--yellow)";
        } else {
            this.shadowRoot.querySelector('.event').style.background = this.getAttribute('color');
        }
    }

    setPosition() {
        this.shadowRoot.querySelector('.event').style.top = this.getAttribute('top');
        this.shadowRoot.querySelector('.event').style.bottom = this.getAttribute('bottom');
        this.shadowRoot.querySelector('.event').style.width = this.getAttribute('width');
    }

    addMark() {
        this.shadowRoot.querySelector('.event').classList.add("mark");
    }

    removeMark() {
        this.shadowRoot.querySelector('.event').classList.remove("mark");
    }
}

window.customElements.get('event-slot') || window.customElements.define('event-slot', EventSlot);