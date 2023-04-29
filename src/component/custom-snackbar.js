const template = document.createElement('template');
template.innerHTML = `
    <style>
    .snackbar {
        visibility: hidden;
        width: 250px;
        transform: translateX(-50%); 
        background-color: var(--yellow); 
        color: var(--black); 
        text-align: center;
        border-radius: 2px;
        padding: 16px; 
        position: fixed; 
        z-index: 20; 
        left: 50%; 
        bottom: 30px; 
        visibility: visible;
        bottom: 30px; 
        opacity: 1;
      }
      
    .snackbar.show {
        visibility: visible;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
        }
    
    @keyframes fadein {
        from {bottom: 0; opacity: 0;}
        to {bottom: 30px; opacity: 1;}
    }
    
    @keyframes fadeout {
        from {bottom: 30px; opacity: 1;}
        to {bottom: 0; opacity: 0;}
    }
    </style>
    <div class="snackbar">
        <h3></h3>
    </div>
`;

class CustomSnackbar extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('text');
    }

    // show(text) {
    //     this.shadowRoot.classList.add(".show");
    //     this.shadowRoot.querySelector('h3').innerText = text;

    //     setTimeout(() => { 
    //         this.shadowRoot.classList.remove(".show"); 
    //     }, 3000);
    // }
}

window.customElements.define('custom-snackbar', CustomSnackbar);

