import './intro-modal.css';

export default class IntroModal {
    constructor() {
        this.template = document.getElementsByTagName("template")[0];
        this.clon = this.template.content.cloneNode(true);

    }

    show() {
        document.body.appendChild(this.clon);

        scroll(0, 0);
        document.body.classList.add("opaque");
        document.body.style.overflow = 'hidden';
        const container = document.getElementById("introModal");

        const okButton = container.querySelector(".okButton");
        okButton.addEventListener("click", () => this.close());
    }

    close() {
        const container = document.getElementById("introModal");
        container.remove();
        document.body.classList.add("transparent");
        setTimeout(() => {
            document.body.classList.remove("transparent");
            document.body.classList.remove("opaque");
            document.body.style.overflow = 'auto'; 
        }, 200); 
    }
}