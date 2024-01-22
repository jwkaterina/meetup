import html from './form-modal.hbs'
import './form-modal.css';
import './modals-common.css';

export default class FormModal {
    constructor(container) {
        this.container = container;
        this.container.innerHTML = html();
        this.types = this.container.querySelectorAll('input[name="type"]');        
        this.place = document.getElementById("eventPlace");
        this.date = document.getElementById("eventDate");
        this.start = document.getElementById("eventStart");
        this.end = document.getElementById("eventEnd");
        this.comment = document.getElementById("eventComment");
        this.errors = document.getElementById("errors");
        this.requiredInputs = this.container.querySelectorAll("[required]");
        this.createButton = this.container.querySelector(".createButton");
        this.updateButton = this.container.querySelector(".updateButton");
        this.deleteButton = this.container.querySelector(".deleteButton");
        this.cancelButton = this.container.querySelector(".cancelButton");
        this.flipCard = this.container.querySelector(".flip-card-inner");
        this.flipCardBack = this.container.querySelector(".flip-card-back");
        this.flipCardText = this.container.querySelector(".flipCardText");
    }

    get newStart() {
        return this.start.value;
    }

    get newEnd() {
        return this.end.value;
    }

    get newDate() {
        return this.date.value;
    }

    get customSelectContainer() {
        return this.container.querySelector("#name");
    }

    hideCreateButton() {
        this.createButton.style.display = "none";
    }

    hideUpdateButton() {
        this.updateButton.style.display = "none";
    }

    hideDeleteButton() {
        this.deleteButton.style.display = "none";
    }

    showCreateButton() {
        this.createButton.style.display = "";
    }

    showUpdateButton() {
        this.updateButton.style.display = "";
    }

    showDeleteButton() {
        this.deleteButton.style.display = "";
    }

    enableButtons() {
        this.updateButton.disabled = false;
        this.createButton.disabled = false;
        this.deleteButton.disabled = false;
        this.cancelButton.disabled = false;
    }

    disableButtons() {
        this.updateButton.disabled = true;
        this.createButton.disabled = true;
        this.deleteButton.disabled = true;
        this.cancelButton.disabled = true;
    }

    showModal() {
        this.container.classList.add("show-modal");
    }

    hideModal() {
        this.container.classList.add("hide-modal");
        this.date.disabled = false;
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
        document.body.classList.add("opaque");
        document.body.style.overflow = 'hidden';
    }

    open() {
        this.showModal();
        this.hideCalendar();
    }

    close() {
        this.hideErrors();
        this.hideModal();
        this.showCalendar();       
    }

    showError(message) {
        this.errors.classList.add("show-message");
        this.errors.querySelector("p").innerHTML = message;
    }

    hideErrors() {
        this.errors.querySelector("p").innerHTML = "";    
        this.errors.classList.remove("show-message");
        document.querySelectorAll(".alert").forEach((alert) => {
            alert.classList.remove("show-message");
        })
    }

    animateFlip(){
        this.flipCardBack.style.display = "flex";
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
            this.flipCardBack.style.display = "none";
        },2000); 
    }

    writeOnFlip(text) {
        this.flipCardText.textContent = text;
    }

    formIsValid() {
        const inputs = Array.from(this.requiredInputs);

        if (inputs.find((input) => {return input.value == ""})) {
            inputs.forEach((input) => {
                if (input.value == "") {
                    const alert = input.nextElementSibling;
                    alert.classList.add("show-message");
                }
            });
            return false;
        } 

        inputs.forEach((input) => {
            const alert = input.nextElementSibling;
            alert.classList.remove("show-message");
        });
        return true;
    }

    static build(parent = document.body) {
        const container = document.createElement("div");
        container.id = "formModal";
        container.className = "modal";
        parent.appendChild(container);
        return new FormModal(container);
    }
}
