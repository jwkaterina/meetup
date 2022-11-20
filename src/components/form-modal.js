import './form-modal.css';
import './modals-common.css';

export class FormModal {
    constructor() {
        this.formModal = document.getElementById("formModal");
        this.submitButton = this.formModal.querySelector(".submitButton");
        this.submitCallback = null;
        this.deleteButton = this.formModal.querySelector(".deleteButton");
        this.deleteCallback = null;
        this.cancelButton = this.formModal.querySelector(".cancelButton");
        this.flipCard = this.formModal.querySelector(".flip-card-inner");
        this.flipCardText = this.formModal.querySelector(".flipCardText");

        // see: https://www.w3schools.com/js/js_function_bind.asp
        const close = this.close.bind(this);
        this.cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            close();
        });
    }

    hideSubmitButton() {
        this.submitButton.style.display = "none";
    }

    hideDeleteButton() {
        this.deleteButton.style.display = "none";
    }

    onSubmit(cb, value) {
        this.submitButton.value = value;
        this.oneTimeListener(this.submitButton, "click", cb);
    }

    onDelete(cb) {
        this.oneTimeListener(this.deleteButton, "click", cb);
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


    oneTimeListener(element, type, callback) {
        element.style.display = "";

        element.addEventListener(type, function listener(e) {
            e.target.removeEventListener(type, listener);
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