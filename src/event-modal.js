export class EventModal {
    constructor(onClose) {
        this.eventModal = $("#eventModal");
        this.cancelButton = this.eventModal.find(".cancelButton");
        this.cancelButton.click((e) => {
            e.preventDefault();
            onClose();
        });
        this.editButton = this.eventModal.find(".editButton");
        this.submitButton = this.eventModal.find(".submitButton");
        this.deleteButton = this.eventModal.find(".deleteButton");

        this.flipCard = this.eventModal.find(".flip-card-inner");
    }

    hideEditButton() {
        this.editButton.hide();
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

    onEdit(cb) {
        this.onClick(this.editButton, cb);
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