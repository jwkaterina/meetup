import './event-modal.css';
import './modals-common.css';

export class EventModal {
    constructor() {
        this.eventModal = document.getElementById("eventModal");
        this.editButton = this.eventModal.querySelector(".editButton");
        this.submitButton = this.eventModal.querySelector(".submitButton");
        this.deleteButton = this.eventModal.querySelector(".deleteButton");
        this.cancelButton = this.eventModal.querySelector(".cancelButton");
        this.flipCard = this.eventModal.querySelector(".flip-card-inner");
        this.flipCardText = this.eventModal.querySelector(".flipCardText");
    }

    hideEditButton() {
        this.editButton.style.display = "none";
    }

    hideSubmitButton() {
        this.submitButton.style.display = "none";
    }

    hideDeleteButton() {
        this.deleteButton.style.display = "none";
    }
    showEditButton() {
        this.editButton.style.display = "";
    }

    showSubmitButton() {
        this.submitButton.style.display = "";
    }

    showDeleteButton() {
        this.deleteButton.style.display = "";
    }

    showModal() {
        this.eventModal.style.display = "block";
    }

    hideModal() {
        this.eventModal.style.display = "none";
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
        document.querySelector('body').classList.remove("opaque");
        document.querySelector('body').style.overflow = 'auto'; 
    }

    hideCalendar() {
        scroll(0, 0);
        document.querySelector('body').classList.add("opaque");
        document.querySelector('body').style.overflow = 'hidden';
    }

    animateFlip(){
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
        },1000); 
    }

    writeOnFlip(text) {
        this.flipCardText.textContent = text;
    }
}