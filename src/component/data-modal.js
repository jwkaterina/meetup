import './data-modal.css';
import './modals-common.css';

export default class DataModal {
    constructor() {
        this.dataModal = document.getElementById("dataModal");
        this.firstName = document.getElementById("user-firstName");
        this.lastName = document.getElementById("user-lastName");
        this.phoneNumber = document.getElementById("user-phoneNumber");
        // this.errors = document.getElementById("errors");
        this.submitButton = this.dataModal.querySelector(".submitButton");
        this.cancelButton = this.dataModal.querySelector(".cancelButton");
        this.flipCard = this.dataModal.querySelector(".flip-card-inner");
        this.flipCardText = this.dataModal.querySelector(".flipCardText");
        this.inputs = this.dataModal.querySelectorAll(".shortInput")
    }

    showModal() {
        this.dataModal.style.display = "block";
    }

    hideModal() {
        this.dataModal.style.display = "none";
        this.enableButtons();
    }

    enableButtons() {
        this.submitButton.disabled = false;
        this.cancelButton.disabled = false;
    }

    disableButtons() {
        this.submitButton.disabled = true;
        this.cancelButton.disabled = true;
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

    hideErrors() {
        // this.errors.querySelector("p").innerHTML = "";    
        // this.errors.classList.remove("show-message");
        document.querySelectorAll(".alert").forEach((alert) => {
            alert.classList.remove("show-message");
        })
    }


    animateFlip() {
        this.flipCard.classList.add("flip");
        setTimeout(() => {
            this.flipCard.classList.remove("flip");
        },2000); 
    }

    formIsValid() {
        if(this.firstName.value != "" && this.lastName.value == "") {
            this.showAlert(this.lastName);
            return false
        } else if (this.firstName.value == "" && this.lastName.value != "") {
            this.showAlert(this.firstName);
            return false
        } else {
            if(this.phoneNumber.value != "" && !this.phoneIsValid()){
                this.showAlert(this.phoneNumber);
                return false
            } else {
                const inputs = Array.from(this.inputs);
                inputs.forEach((input) => {
                const alert = input.nextElementSibling;
                alert.classList.remove("show-message");
            });
                return true
            }
        }
    }

    showAlert(input) {
        const alert = input.nextElementSibling;
        alert.classList.add("show-message");
    }

    phoneIsValid() {
        // Create function
        return true
    }
}
