import './confirm-modal.css';
import './modals-common.css';

export default class ConfirmModal {
    constructor() {
        this.confirmModal = document.getElementById("confirmModal");
        this.yesButton = this.confirmModal.querySelector(".yesButton");
        this.noButton = this.confirmModal.querySelector(".noButton");
        this.flipCard = this.confirmModal.querySelector(".flip-card-inner");
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
        this.confirmModal.classList.add("show-modal");
    }

    hideModal() {
        this.confirmModal.classList.add("hide-modal");
        this.enableButtons();
        setTimeout(() => {
            this.confirmModal.classList.remove("show-modal");
            this.confirmModal.classList.remove("hide-modal");
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
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
        },2000); 
    }
}