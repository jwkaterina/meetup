import { Context } from "./ctx";
import { EventModal } from "./event-modal";
import { PrincipalCommon } from "./principal";


export class User {
    constructor(calendar) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = new PrincipalCommon();
        this.eventModal = new EventModal(() => {
            this.eventModal.close();
        });
        this.eventModal.hideEditButton();
    }

    openEventModal(event) {
        this.eventModal.open();
        this.common.addEventContent(event);
        if (this.common.userFound(event)) {
            this.eventModal.hideSubmitButton();
            this.eventModal.onDelete(() => {
                this.common.deleteName(event, this.calendar, this.eventModal);
            });
        } else {
            this.eventModal.hideDeleteButton();
            this.eventModal.onSubmit(() => {
                this.common.addName(event, this.calendar, this.eventModal);
            });
        }
    }

    clickSlot(hour, dayIndex) {
     return
    }

    createNewEvent() {
      return
    }
}

