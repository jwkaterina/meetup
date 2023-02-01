import './data-modal.css';
import './modals-common.css';

export default class DataModal {
    constructor() {
        this.dataModal = document.getElementById("dataModal");
        this.firstName = document.getElementById("user-firstName");
        this.lastName = document.getElementById("user-lastName");
        this.phoneNumber = document.getElementById("user-phoneNumber");
        this.submitButton = this.dataModal.querySelector(".submitButton");
        this.cancelButton = this.dataModal.querySelector(".cancelButton");
        this.flipCard = this.dataModal.querySelector(".flip-card-inner");
        this.flipCardText = this.dataModal.querySelector(".flipCardText");
        this.inputs = this.dataModal.querySelectorAll(".shortInput");
        this.notifyMe = this.dataModal.querySelector(".checkbox > .container > input");
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
        this.dataModal.classList.add("show-modal");
    }

    hideModal() {
        this.dataModal.classList.add("hide-modal");
        this.enableButtons();
        setTimeout(() => {
            this.dataModal.classList.remove("show-modal");
            this.dataModal.classList.remove("hide-modal");
        }, 500);
    }

    showCalendar() {
        document.body.classList.add("transparent");
        setTimeout(() => {
            document.body.classList.remove("transparent");
            document.body.classList.remove("opaque");
            document.body.style.overflow = 'auto'; 
        }, 500);
        
    }

    hideCalendar() {
        scroll(0, 0);
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
