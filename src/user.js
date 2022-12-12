import { Context } from "./ctx";
import { nameFound } from "./helper";


export class User {
    constructor(calendar, principalCommon) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = principalCommon;
        this.common.eventModal.hideEditButton();
    }

    openEventModal(event) {
        this.ctx.currentEvent = event;
        // console.log(this.ctx.currentEvent.id);
        this.common.eventModal.open();
        this.common.addEventContent(event);
        if (nameFound(event, this.ctx.userName)) {
            this.common.eventModal.hideSubmitButton();
            this.common.eventModal.showDeleteButton();
        } else {
            this.common.eventModal.hideDeleteButton();
            this.common.eventModal.showSubmitButton();
        }
    }

    clickSlot(hour, dayIndex) {
     return
    }

    createNewEvent() {
      return
    }
}

