export class ConfirmModal {
    constructor(onCancel) {
        this.confirmModal = $("#confirmModal");
        this.yesButton = this.confirmModal.find(".yesButton");
        this.noButton = this.confirmModal.find(".noButton");
        this.flipCard = this.confirmModal.find(".flip-card-inner");
        // this.flipCardText = this.confirmModal.find(".flipCardText");
        // this.modalTitle = $("#modalTitle");

        this.onCancel(onCancel);
    }

    fadeIn() {
        this.confirmModal.fadeIn(200);
    }
    fadeOut() {
        this.confirmModal.fadeOut(200);
    }

    onCancel(cb) {
        this.onClick(this.noButton, cb);
    }

    onConfirm(cb) {
        this.onClick(this.yesButton, cb);
    }

    open() {
        this.fadeIn();
        this.hideCalendar();
    }

    close() {
        this.fadeOut();
        this.showCalendar();
    }

    onClick(element, callback) {
        element
        .show()
        .off("click")
        .click((e) => {
            e.preventDefault();
            callback();
        });
    }

    animateFlip(){
        this.flipCard.addClass("flip");
        const that = this;
        setTimeout(function() {
            that.flipCard.removeClass("flip");
        },1000); 
    }

    // writeOnFlip(text) {
    //     this.flipCardText.text(text);
    // }

    // writeOnTitle(text) {
    //     this.modalTitle.text(text);
    // }

    showCalendar() {
        $("#calendar").removeClass("opaque");
        document.querySelector('body').style.overflow = 'auto'; 
    }

    hideCalendar() {
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
    }

//     resize() {
//         this.formModal
//             .css("height", "500px")
//             .css("top", "10px")
//             .css("overflow", "auto");
//         this.flipCard.css("height", "500px");
//     }
}