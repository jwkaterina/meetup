export class FormModal {
    constructor(onCancel) {
        this.formModal = $("#formModal");
        this.cancelButton = this.formModal.find(".cancelButton");
        this.submitButton = this.formModal.find(".submitButton");
        this.deleteButton = this.formModal.find(".deleteButton");
        this.flipCard = this.formModal.find(".flip-card-inner");

        this.onCancel(onCancel);
    }

    hideSubmitButton() {
        this.submitButton.hide();
    }
    hideDeleteButton() {
        this.deleteButton.hide();
    }
    fadeIn() {
        this.eventModal.fadeIn(200);
    }
    fadeOut() {
        this.eventModal.fadeOut(200);
    }

    onCancel(cb) {
        this.onClick(this.cancelButton, cb);
    }

    onSubmit(cb) {
        this.onClick(this.submitButton, cb);
    }

    onDelete(cb) {
        this.onClick(this.deleteButton, cb);
    }

    close() {
        this.fadeOut();
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
}