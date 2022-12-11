import { Context } from "./ctx";
import { Event } from "./components/event";
import { FormModal } from "./components/form-modal";
import { ConfirmModal } from "./components/confirm-modal";
import { dateString, addDays, nameFound } from "./helper";

export class Admin {
    constructor(calendar, principalCommon) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = principalCommon;
        this.formModal = new FormModal();
        this.confirmModal = new ConfirmModal();
        window.addEventListener("resize", (e) => {
            this.formModal.resize();
          });

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
            console.log(this.ctx.currentEvent);
        });
        this.confirmModal.yesButton.addEventListener("click", () => {
            this.deleteEvent();
            this.ctx.currentEvent = null;
            console.log(this.ctx.currentEvent);
        });
        this.confirmModal.noButton.addEventListener("click", () => {
            this.confirmModal.close();
            this.ctx.currentEvent = null;
            console.log(this.ctx.currentEvent);
        });
    }

    openEventModal(event) {
        this.ctx.currentEvent = event;
        console.log(this.ctx.currentEvent.id);
        this.common.eventModal.open();
        this.common.addEventContent(event);
        this.common.eventModal.showEditButton();
        if(!nameFound(event, this.ctx.userName)) {
            this.common.eventModal.hideDeleteButton();
            this.common.eventModal.showSubmitButton();
            return
        }
        if (this.ctx.userName == event.names[0]) {
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
            names: [],
            color: "var(--green)"
        });
        this.ctx.currentEvent = event;
        this.openCreateFormModal(event);
    }

    openCreateFormModal(event) {
        console.log(event.id);
        this.formModal.open();
        this.formModal.writeOnFlip("Ça y est! L'équipe est crée.");
        this.formModal.showSubmitButton("Creer");
        this.formModal.hideDeleteButton();

        this.formModal.place.value = event.place;
        this.formModal.name.value = this.ctx.userName;
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
        this.formModal.place.focus();
    }

    openChangeFormModal() {
        // this.ctx.currentEvent = event;
        const event = this.ctx.currentEvent;
        console.log(event.id);
        this.formModal.open();
        this.formModal.writeOnFlip("Ça y est! L'équipe est changé.");
        this.formModal.showSubmitButton("Changer");
        this.formModal.showDeleteButton();

        this.formModal.place.value = event.place;
        this.formModal.name.value = this.ctx.userName;
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
        // this.formModal.place.focus();
    }

    openConfirmModal() {
        console.log(this.ctx.currentEvent.id);
        this.confirmModal.open();
        // this.confirmModal.writeOnTitle("Veux tu effacer l'équipe?");
    }

    submitEvent() {
        console.log("submit");
        const event = this.ctx.currentEvent;
        if(this.calendar.isEventValid(event) && this.formModal.formIsValid()) {
            this.updateEvent(event);
            this.formModal.animateFlip();       
            setTimeout(() => {
                this.formModal.close();
            },1000);
            this.ctx.currentEvent = null;
            console.log(this.ctx.currentEvent);
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
        this.newMainName = this.formModal.name.value;
        if(nameFound(event, this.newMainName) && event.names[0] !== this.newMainName) {
            const index = event.names.indexOf(this.newMainName);
            event.names.splice(index, 1);
        }
        event.names[0] = this.newMainName;

        this.calendar.saveEvent(event);
        event.show();
    }

    deleteEvent() {
        // this.confirmModal.writeOnFlip("L'équipe est effacée.");
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
            names: [],
            color: "green",
        });
        this.ctx.currentEvent = event;
        this.openCreateFormModal(event);
    }
}