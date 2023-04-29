import './intro-modal.css';

export default class IntroModal {
    constructor() {
        this.container = document.getElementById("introModal");
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
}