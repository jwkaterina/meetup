import './data-modal.css';
import './modals-common.css';

export default class DataModal {
    constructor() {
        this.container = document.getElementById("dataModal");
        this.firstName = document.getElementById("user-firstName");
        this.lastName = document.getElementById("user-lastName");
        this.phoneNumber = document.getElementById("user-phoneNumber");
        this.submitButton = this.container.querySelector(".submitButton");
        this.cancelButton = this.container.querySelector(".cancelButton");
        this.cancelButton.addEventListener("click", () => this.close());
        this.flipCard = this.container.querySelector(".flip-card-inner");
        this.flipCardBack = this.container.querySelector(".flip-card-back");
        this.flipCardText = this.container.querySelector(".flipCardText");
        this.inputs = this.container.querySelectorAll(".shortInput");
        this.labels = this.container.querySelectorAll(".label");
        this.firstNameLabel = document.getElementById("firstName-label");
        this.lastNameLabel = document.getElementById("lastName-label");
        this.notifyMe = this.container.querySelector(".checkbox > .container > input");
        this.notifyMe.checked = this._loadNotificationSettingsFromLocalStorage();
    }

    enableButtons() {
        this.submitButton.disabled = false;
        this.cancelButton.disabled = false;
    }

    disableButtons() {
        this.submitButton.disabled = true;
        this.cancelButton.disabled = true;
    }

    showModal() {
        this.container.classList.add("show-modal");
    }

    hideModal() {
        this.container.classList.add("hide-modal");
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

    hideErrors() {
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

    formIsValid() {
        const inputs = Array.from(this.inputs);

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

    onSubmit(cb) {
        this.submitButton.addEventListener("click", cb);
    }

    onNotifyMe(notifier) {
        this.notifyMe.addEventListener('click', () => {
            if (this.notifyMe.checked) {
                notifier.subscribe();
                this._saveNotificationSettingsToLocalStorage(true);
            } else {
                notifier.unsubscribe();
                this._saveNotificationSettingsToLocalStorage(false);
            }
        });
    }

    _loadNotificationSettingsFromLocalStorage() {
        const notificationStr = localStorage.getItem("notificationsEnabled");
        return notificationStr === 'true';
    }

    _saveNotificationSettingsToLocalStorage(enabled) {
        localStorage.setItem("notificationsEnabled", String(enabled));
    }
}
