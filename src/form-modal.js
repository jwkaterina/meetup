export class FormModal {
    constructor(onCancel) {
        this.formModal = $("#formModal");
        this.cancelButton = this.formModal.find(".cancelButton");
        this.submitButton = this.formModal.find(".submitButton");
        this.deleteButton = this.formModal.find(".deleteButton");
        this.flipCard = this.formModal.find(".flip-card-inner");
        this.flipCardText = this.formModal.find(".flipCardText");
        this.modalTitle = $("#modalTitle");

        this.onCancel(onCancel);
    }

    hideSubmitButton() {
        this.submitButton.hide();
    }
    hideDeleteButton() {
        this.deleteButton.hide();
    }
    fadeIn() {
        this.formModal.fadeIn(200);
    }
    fadeOut() {
        this.formModal.fadeOut(200);
    }

    onCancel(cb) {
        this.onClick(this.cancelButton, cb);
    }

    onSubmit(cb, value) {
        this.onClick(this.submitButton, cb);
        this.submitButton.val(value);
    }

    onDelete(cb) {
        this.onClick(this.deleteButton, cb);
    }

    open() {
        this.fadeIn();
        this.hideCalendar();
    }

    close() {
        this.fadeOut();
        this.showCalendar();
        $("#errors").text("");
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

    writeOnFlip(text) {
        this.flipCardText.text(text);
    }

    writeOnTitle(text) {
        this.modalTitle.text(text);
    }

    showCalendar() {
        $("#calendar").removeClass("opaque");
        document.querySelector('body').style.overflow = 'auto'; 
    }

    hideCalendar() {
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
    }
}