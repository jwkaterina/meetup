import './confirm-modal.css';
import './modals-common.css';

export default class ConfirmModal {
    constructor() {
        this.container = document.getElementById("confirmModal");
        this.yesButton = this.container.querySelector(".yesButton");
        this.noButton = this.container.querySelector(".noButton");
        this.flipCard = this.container.querySelector(".flip-card-inner");
        this.flipCardBack = this.container.querySelector(".flip-card-back");
    }

    enableButtons() {
        this.yesButton.disabled = false;
        this.noButton.disabled = false;
    }

    disableButtons() {
        this.yesButton.disabled = true;
        this.noButton.disabled = true;
    }

    showModal() {
        this.container.classList.add("show-modal");
    }

    hideModal() {
        this.container.classList.add("hide-modal");
        this.enableButtons();
        setTimeout(() => {
            this.container.classList.remove("show-modal");
            this.container.classList.remove("hide-modal");
        }, 200);
    }

    showCalendar() {
        document.body.classList.add("transparent");
        setTimeout(() => {
            document.body.classList.remove("transparent");
            document.body.classList.remove("opaque");
            document.body.style.overflow = 'auto'; 
        }, 200);
        
    }

    hideCalendar() {
        scroll(0, 0);
        document.body.classList.add("opaque");
        document.body.style.overflow = 'hidden';
    }

    open() {
        this.showModal();
        this.hideCalendar();
    }

    close() {
        this.hideModal();
        this.showCalendar();
    }

    animateFlip(){
        this.flipCardBack.style.display = "flex";
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
            this.flipCardBack.style.display = "none";
        },2000); 
    }
}