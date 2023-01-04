import { Context } from "./ctx";

export default class User {
    constructor(calendar, principalCommon) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = principalCommon;
        this.common.eventModal.hideEditButton();
    }

    get userName() {
        return this.common.user.userName;
    }

    openEventModal(event) {
        this.ctx.currentEvent = event;
        this.common.eventModal.open();
        this.common.addEventContent(event);
        if (event.names.includes(this.common.user.userName)) {
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

