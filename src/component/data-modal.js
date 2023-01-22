import './data-modal.css';
import './modals-common.css';

export default class DataModal {
    constructor() {
        this.dataModal = document.getElementById("dataModal");
        this.firstName = document.getElementById("user-firstName");
        this.lastName = document.getElementById("user-lastName");
        // this.errors = document.getElementById("errors");
        this.submitButton = this.dataModal.querySelector(".submitButton");
        this.cancelButton = this.dataModal.querySelector(".cancelButton");
        this.flipCard = this.dataModal.querySelector(".flip-card-inner");
        this.flipCardText = this.dataModal.querySelector(".flipCardText");
    }

    // get newStart() {
    //     return this.start.value;
    // }

    // get newEnd() {
    //     return this.end.value;
    // }

    // get newDate() {
    //     return this.date.value;
    // }

    // hideSubmitButton() {
    //     this.submitButton.style.display = "none";
    // }

    // showSubmitButton() {
    //     this.submitButton.style.display = "";
    // }

    showModal() {
        this.dataModal.style.display = "block";
    }

    hideModal() {
        this.dataModal.style.display = "none";
        // this.date.disabled = false;
    }

    open() {
        this.showModal();
        this.hideCalendar();
    }

    close() {
        // this.hideErrors();
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

    // showError(message) {
    //     this.errors.classList.add("show-message");
    //     this.errors.querySelector("p").innerHTML = message;
    // }

    // hideErrors() {
    //     this.errors.querySelector("p").innerHTML = "";    
    //     this.errors.classList.remove("show-message");
    //     document.querySelectorAll(".alert").forEach((alert) => {
    //         alert.classList.remove("show-message");
    //     })
    // }


    animateFlip() {
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
        },1000); 
    }

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
