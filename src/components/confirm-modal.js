import './confirm-modal.css';
import './modals-common.css';

export class ConfirmModal {
    constructor() {
        this.confirmModal = document.getElementById("confirmModal");
        this.yesButton = this.confirmModal.querySelector(".yesButton");
        this.noButton = this.confirmModal.querySelector(".noButton");
        this.flipCard = this.confirmModal.querySelector(".flip-card-inner");
        // this.flipCardText = this.confirmModal.querySelector(".flipCardText");
        // this.modalTitle = document.getElementById("modalTitle");

        // see: https://www.w3schools.com/js/js_function_bind.asp
        const close = this.close.bind(this);
        this.noButton.addEventListener("click", (e) => {
            e.preventDefault();
            close();
        });    }

    onConfirm(cb) {
        this.oneTimeListener(this.yesButton, "click", cb);
    }

    showModal() {
        this.confirmModal.style.display = "block";
    }

    hideModal() {
        this.confirmModal.style.display = "none";
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

    // writeOnFlip(text) {
    //     this.flipCardText.textContent = text;
    // }

    // writeOnTitle(text) {
    //     this.modalTitle.textContent = text;
    // }
}