class EventSlot extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector('.event-img').src = this.getAttribute('imgsrc');
    }

    setNumber() {
        this.shadowRoot.querySelector('.event-number').innerText = this.getAttribute('number');
    }

    setImage() {
        this.shadowRoot.querySelector('.event-img').src = this.getAttribute('imgsrc');
    }

    setColor() {
        this.shadowRoot.querySelector('.event').style.background = this.getAttribute('color');
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

window.customElements.define('event-slot', EventSlot);

const template = document.createElement('template');
template.innerHTML = `
    <style>
        * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    .event {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        position: absolute;
        text-align: center;
        left: 0px;
        line-height: 1rem;
        font-size: 0.8rem;
        padding: 0.5rem 0.8rem;
        color: var(--white);
        overflow: hidden;
        cursor: pointer;
        transition: all 0.5s linear ;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19);
    }
    
    .mark:after {
        content: "";
        position: absolute;
        top: 0;
        right: 5px;
        border-left: solid 6px var(--yellow);
        border-right: solid 6px var(--yellow);
        border-bottom: solid 8px transparent;
        border-top: solid 12px var(--yellow);
    }
    
    .event:hover {
        background-color: var(--gray-darker) !important;
    }
    
    .event-img {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 30px;
        height: 30px;
    }
    
    .event-number {
        color: var(--white);
        position: absolute;
        right: 5px;
        bottom: 5px;
        font-size: 15px;
        font-weight: bold;
    }
    
    @media (max-width: 720px) {
        .mark:after {
            right: 3px;
            border-left: solid 6px var(--yellow);
            border-right: solid 6px var(--yellow);
            border-bottom: solid 6px transparent;
            border-top: solid 10px var(--yellow);
        }
    
        .event-img {
            top: 2px;
            left: 2px;
            width: 25px;
            height: 25px;
        }
    
        .event-number {      
            right: 5px;
            bottom: 2px;
            font-size: 12px;
        }
    
        .event {
            padding: 0.5rem 0.5rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 3px 10px rgba(0, 0, 0, 0.19);
        }
    }
    </style>
    <div class="event">
        <img class="event-img">
        <p class="event-number"></p>
    </div>
`;