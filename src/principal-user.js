import { Context } from "./ctx";

export default class PrincipalUser {
    constructor(eventCalendar, principalCommon) {
        this.eventCalendar = eventCalendar;
        this.ctx = Context.getInstance();
        this.common = principalCommon;
        this.common.eventModal.hideEditButton();
    }

    get user() {
        return this.common.user;
    }

    set user(newUser) {
        this.common.user = newUser;
    }

    openEventModal(event) {
        this.ctx.currentEvent = event;
        this.common.eventModal.open();
        this.common.addEventContent(event);
        if (event.memberIds.includes(this.user.id)) {
            this.common.eventModal.hideJoinButton();
            this.common.eventModal.showDeleteButton();
        } else {
            this.common.eventModal.hideDeleteButton();
            this.common.eventModal.showJoinButton();
        }
    }

    clickSlot(hour, dayIndex) {
        return
    }

    createNewEvent() {
        return
    }
}

