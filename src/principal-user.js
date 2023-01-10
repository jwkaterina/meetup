import { Context } from "./ctx";

export default class PrincipalUser {
    constructor(calendar, principalCommon) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = principalCommon;
        this.common.eventModal.hideEditButton();
    }

    openEventModal(event) {
        const ids = event.members.map((member) => member.id);

        this.ctx.currentEvent = event;
        this.common.eventModal.open();
        this.common.addEventContent(event);
        if (ids.includes(this.common.user.id)) {
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

