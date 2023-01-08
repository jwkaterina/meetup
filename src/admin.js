import { Context } from "./ctx";
import Event from "./components/event";
import FormModal from "./components/form-modal";
import ConfirmModal from "./components/confirm-modal";
import { dateString, addDays } from "./helper";

export default class Admin {
    constructor(calendar, principalCommon) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = principalCommon;
        this.formModal = new FormModal();
        this.confirmModal = new ConfirmModal();

        this.loadEventListeners();
    }

    loadEventListeners() {
        this.common.eventModal.editButton.addEventListener("click", () => {
            this.openChangeFormModal();
            this.common.eventModal.hideModal();
        });

        this.formModal.submitButton.addEventListener("click", () => {
            this.submitEvent();
        });
        this.formModal.deleteButton.addEventListener("click", () => {
            this.openConfirmModal();
            this.formModal.hideModal();
        });
        this.formModal.cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.formModal.close();
            this.ctx.currentEvent = null;
        });
        this.confirmModal.yesButton.addEventListener("click", () => {
            this.deleteEvent();
            this.ctx.currentEvent = null;
        });
        this.confirmModal.noButton.addEventListener("click", () => {
            this.confirmModal.close();
            this.ctx.currentEvent = null;
        });
    }

    get userName() {
        return this.common.user.userName;
    }

    openEventModal(event) {
        const ids = event.members.map((member) => member.id);

        this.ctx.currentEvent = event;
        this.common.eventModal.open();
        this.common.addEventContent(event);
        this.common.eventModal.showEditButton();
        if(!ids.includes(this.common.user.id)) {
            this.common.eventModal.hideDeleteButton();
            this.common.eventModal.showSubmitButton();
            return
        }
        if (this.common.user.id == event.members[0].id) {
            this.common.eventModal.hideDeleteButton();
            this.common.eventModal.hideSubmitButton();
            return
        } else {
            this.common.eventModal.hideSubmitButton();
            this.common.eventModal.showDeleteButton();
        }
    }

    clickSlot(hour, dayIndex) {
        const start = hour.toString().padStart(2, "0") + ":00";
        const end =
            hour < 23
                ? (hour + 1).toString().padStart(2, "0") + ":00"
                : hour.toString().padStart(2, "0") + ":59";

        const date = dateString(addDays(this.ctx.weekStart, dayIndex));
        const event = new Event({
            place: "",
            start,
            end,
            date,
            members: [],
            color: "var(--green)"
        });
        this.ctx.currentEvent = event;
        this.openCreateFormModal(event);
    }

    openCreateFormModal(event) {
        this.formModal.open();
        this.formModal.writeOnFlip("Ça y est! Le groupe est créé.");
        this.formModal.showSubmitButton("Créer");
        this.formModal.hideDeleteButton();

        this.formModal.place.value = event.place;
        this.formModal.showOptions(this.common.user);
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
        this.formModal.place.focus();
    }

    openChangeFormModal() {
        const event = this.ctx.currentEvent;
        this.formModal.open();
        this.formModal.writeOnFlip("Ça y est! Le groupe est changé.");
        this.formModal.showSubmitButton("Changer");
        this.formModal.showDeleteButton();

        this.formModal.place.value = event.place;
        this.formModal.showOptions(event.members[0]);
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
    }

    openConfirmModal() {
        this.confirmModal.open();
    }

    submitEvent() {
        const event = this.ctx.currentEvent;
        if(this.formModal.formIsValid() && this.calendar.isEventValid(event)) {
            this.updateEvent(event);
            this.formModal.animateFlip();       
            setTimeout(() => {
                this.formModal.close();
            },1000);
            this.ctx.currentEvent = null;
        } else {
            return;
        }
    }

    updateEvent(event) {
        event.place = this.formModal.place.value;
        event.prevDate = event.date;
        event.start = this.formModal.start.value;
        event.end = this.formModal.end.value;
        event.date = this.formModal.date.value;

        const selectedIndex = this.formModal.name.selectedIndex;
        this.newMainName = this.formModal.name.options[selectedIndex].value;
        this.newMainId = this.formModal.name.options[selectedIndex].id;
        this.newMain = {userName: this.newMainName, id: this.newMainId};

        const ids = event.members.map((member) => member.id);        
        if(ids.includes(this.newMainId) && event.members[0].id !== this.newMainId) {
            const index = ids.indexOf(this.newMainId);
            event.members.splice(index, 1);
        }
        event.members[0] = this.newMain;
        this.calendar.saveEvent(event);
        event.show();
    }

    deleteEvent() {
        this.confirmModal.animateFlip();     
        setTimeout(() => {
            this.confirmModal.close();
        },1000);
        document.getElementById(this.ctx.currentEvent.id).remove();
        delete this.calendar.events[this.ctx.currentEvent.date][this.ctx.currentEvent.id];
        if (Object.values(this.calendar.events[this.ctx.currentEvent.date]).length == 0) {
            delete this.calendar.events[this.ctx.currentEvent.date];
        }
        this.calendar.saveEvents();
    }

    createNewEvent() {
        const event = new Event({
            place: "",
            start: "12:00",
            end: "13:00",
            date: dateString(this.ctx.weekStart),
            members: [],
            color: "green",
        });
        this.ctx.currentEvent = event;
        this.openCreateFormModal(event);
    }
}