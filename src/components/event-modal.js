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

        // see: https://www.w3schools.com/js/js_function_bind.asp
        const close = this.close.bind(this);
        this.onClick(this.cancelButton, close);
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

    onEdit(cb) {
        this.onClick(this.editButton, cb);
    }

    onSubmit(cb) {
        this.onClick(this.submitButton, cb);
    }

    onDelete(cb) {
        this.onClick(this.deleteButton, cb);
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
        document.getElementById("calendar").classList.remove("opaque");
        document.querySelector('body').style.overflow = 'auto'; 
    }

    hideCalendar() {
        document.getElementById("calendar").classList.add("opaque");
        document.querySelector('body').style.overflow = 'hidden';
    }

    onClick(element, callback) {
        element.style.display = "";
        element.removeEventListener("click", (e) => {
            e.preventDefault();
            callback();
        });
        element.addEventListener("click", (e) => {
            e.preventDefault();
            callback();
        });
    }

    animateFlip(){
        this.flipCard.classList.add("flip");
        const that = this;
        setTimeout(function() {
            that.flipCard.classList.remove("flip");
        },1000); 
    }

    writeOnFlip(text) {
        this.flipCardText.textContent = text;
    }
}