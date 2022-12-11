import './form-modal.css';
import './modals-common.css';

export class FormModal {
    constructor() {
        this.formModal = document.getElementById("formModal");
        this.place = document.getElementById("eventPlace");
        this.name = document.getElementById("eventMainName");
        this.date = document.getElementById("eventDate");
        this.start = document.getElementById("eventStart");
        this.end = document.getElementById("eventEnd");
        this.submitButton = this.formModal.querySelector(".submitButton");
        this.deleteButton = this.formModal.querySelector(".deleteButton");
        this.cancelButton = this.formModal.querySelector(".cancelButton");
        this.flipCard = this.formModal.querySelector(".flip-card-inner");
        this.flipCardText = this.formModal.querySelector(".flipCardText");
    }

    hideSubmitButton() {
        this.submitButton.style.display = "none";
    }

    hideDeleteButton() {
        this.deleteButton.style.display = "none";
    }
    showSubmitButton(value) {
        this.submitButton.style.display = "";
        this.submitButton.value = value;
    }

    showDeleteButton() {
        this.deleteButton.style.display = "";
    }


    showModal() {
        this.formModal.style.display = "block";
    }

    hideModal() {
        this.formModal.style.display = "none";
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

    showCalendar() {
        document.getElementById("calendar").classList.remove("opaque");
        document.querySelector('body').style.overflow = 'auto'; 
    }

    hideCalendar() {
        document.getElementById("calendar").classList.add("opaque");
        document.querySelector('body').style.overflow = 'hidden';
    }

    hideErrors() {
        document.getElementById("errors").innerHTML = "";      
        document.querySelectorAll(".alert").forEach((alert) => {
            alert.classList.remove("show-message");
        })
    }


    animateFlip() {
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
        },1000); 
    }

    writeOnFlip(text) {
        this.flipCardText.textContent = text;
    }

    // resize() {
    //     document.getElementById("formModal").style.top = "5vh";
    //     document.getElementById("formModal").style.height = "90vh";
    //     document.getElementById("formModal").querySelector(".flip-card").style.height = "90vh";
    //     document.getElementById("formModal").style.overflow = 'auto'; 
    //     document.querySelector('body').style.overflow = 'auto'; 
    //     console.log("resized");
    // }

    formIsValid() {
        const inputs = Array.from(document.querySelectorAll(".shortInput"));

        if (inputs.find((input) => {return input.value == "";})) {
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
}