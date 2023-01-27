import './event-modal.css';
import './modals-common.css';

export default class EventModal {
    constructor() {
        this.container = document.getElementById("eventModal");
        this.editButton = this.container.querySelector(".editButton");
        this.joinButton = this.container.querySelector(".joinButton");
        this.deleteButton = this.container.querySelector(".deleteButton");
        this.cancelButton = this.container.querySelector(".cancelButton");
        this.flipCard = this.container.querySelector(".flip-card-inner");
        this.flipCardText = this.container.querySelector(".flipCardText");
        this.flipCardBack = this.container.querySelector(".flip-card-back");
        this.flipCardFront = this.container.querySelector(".flip-card-front");
        this.content = this.container.querySelector("#eventContent");
    }

    hideEditButton() {
        this.editButton.style.display = "none";
    }

    hideJoinButton() {
        this.joinButton.style.display = "none";
    }

    hideDeleteButton() {
        this.deleteButton.style.display = "none";
    }
    showEditButton() {
        this.editButton.style.display = "";
    }

    showJoinButton() {
        this.joinButton.style.display = "";
    }

    showDeleteButton() {
        this.deleteButton.style.display = "";
    }

    showModal() {
        this.container.style.display = "block";
    }

    hideModal() {
        this.container.style.display = "none";
        this.enableButtons();
    }

    enableButtons() {
        this.joinButton.disabled = false;
        this.deleteButton.disabled = false;
        this.cancelButton.disabled = false;
        this.editButton.disabled = false;
    }

    disableButtons() {
        this.joinButton.disabled = true;
        this.deleteButton.disabled = true;
        this.cancelButton.disabled = true;
        this.editButton.disabled = true;
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
        },2000); 
    }

    writeOnFlip(text) {
        this.flipCardText.textContent = text;
    }
    
    setCardColor(color) {
        this.flipCardBack.style.background = color;
        this.flipCardFront.style.background = color;
    }

    setContent(txt) {
        this.content.innerHTML = txt;
    }
}