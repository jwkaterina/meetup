import html from './intro-modal.hbs'
import './intro-modal.css';

export default class IntroModal {
    constructor(container) {
        this.container = container;
        this.container.innerHTML = html();
        this.okButton = this.container.querySelector(".okButton");
        this.okButton.addEventListener("click", () => this.close());
    }

    show() {
        this.container.classList.add("show");
        document.body.classList.add("opaque");
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.container.classList.remove("show");
        document.body.classList.add("transparent");
        setTimeout(() => {
            document.body.classList.remove("transparent");
            document.body.classList.remove("opaque");
            document.body.style.overflow = 'auto'; 
        }, 200); 
    }

    static build(parent = document.body) {
        const container = document.createElement("div");
        container.id = "introModal";
        parent.appendChild(container);
        return new IntroModal(container);
    }
}