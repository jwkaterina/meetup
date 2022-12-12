import './confirm-modal.css';
import './modals-common.css';

export class ConfirmModal {
    constructor() {
        this.confirmModal = document.getElementById("confirmModal");
        this.yesButton = this.confirmModal.querySelector(".yesButton");
        this.noButton = this.confirmModal.querySelector(".noButton");
        this.flipCard = this.confirmModal.querySelector(".flip-card-inner");
        // this.flipCardText = this.confirmModal.querySelector(".flipCardText");
        // this.modalTitle = document.getElementById("modalTitle");
    }

    showModal() {
        this.confirmModal.style.display = "block";
    }

    hideModal() {
        this.confirmModal.style.display = "none";
    }
    
    open() {
        this.showModal();
        this.hideCalendar();
    }

    close() {
        this.hideModal();
        this.showCalendar();
    }

    showCalendar() {
        document.body.classList.remove("opaque");
        document.body.style.overflow = 'auto'; 
    }

    hideCalendar() {
        scroll(0, 0);
        document.body.classList.add("opaque");
        document.body.style.overflow = 'hidden';
    }

    animateFlip(){
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
        },1000); 
    }

    // writeOnFlip(text) {
    //     this.flipCardText.textContent = text;
    // }

    // writeOnTitle(text) {
    //     this.modalTitle.textContent = text;
    // }
}