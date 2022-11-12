export class EventModal {
    constructor(onCancel) {
        this.eventModal = $("#eventModal");
        this.cancelButton = this.eventModal.find(".cancelButton");
        this.cancelButton.click(onCancel);
        this.editButton = this.eventModal.find(".editButton");
        this.submitButton = this.eventModal.find(".submitButton");
        this.deleteButton = this.eventModal.find(".deleteButton");
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

    onClick(element, callback) {
        element
        .show()
        .off("click")
        .click(callback);
    }
}