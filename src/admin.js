import { Context } from "./ctx";
import { Event } from "./components/event";
import { FormModal } from "./components/form-modal";
import { ConfirmModal } from "./components/confirm-modal";
import { EventModal } from "./components/event-modal";
import { dateString, addDays} from "./helper";
import { PrincipalCommon } from "./principal";

export class Admin {
    constructor(calendar) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = new PrincipalCommon();
        this.eventModal = new EventModal();
        this.formModal = new FormModal();
        this.confirmModal = new ConfirmModal();
        // window.addEventListener("resize", (e) => {
        //     this.formModal.resize();
        //   });
    }

    openEventModal(event) {

        this.eventModal.open();
        this.common.addEventContent(event);
        this.eventModal.onEdit(() => {
            this.eventModal.close();
            this.openChangeFormModal(event);
        })
        if(!this.common.nameFound(event, this.ctx.userName)) {
            this.eventModal.hideDeleteButton();
            this.eventModal.onSubmit(() => {
                this.common.addName(event, this.calendar, this.eventModal);
            });
            return
        }
        if (this.ctx.userName == event.names[0]) {
            this.eventModal.hideDeleteButton();
            this.eventModal.hideSubmitButton();
            return
        } else {
            this.eventModal.hideSubmitButton();
            this.eventModal.onDelete(() => {
                this.common.deleteName(event, this.calendar, this.eventModal);
            });
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
        this.openCreateFormModal(event);
    }

    openCreateFormModal(event) {
        this.formModal.open();
        this.formModal.writeOnFlip("Ça y est! L'équipe est crée.");
        this.formModal.submitValue("Creer");
        this.formModal.onSubmit(() => {
            this.submitEvent(event);
        });
        this.formModal.hideDeleteButton();

        this.formModal.place.value = event.place;
        this.formModal.name.value = this.ctx.userName;
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
        this.formModal.place.focus();
    }

    openChangeFormModal(event) {
        this.formModal.open();
        this.formModal.writeOnFlip("Ça y est! L'équipe est changé.");
        this.formModal.submitValue("Changer");
        this.formModal.onSubmit(() => {
            this.submitEvent(event);
        });
        this.formModal.onDelete(() => {
            this.formModal.close();
            this.openConfirmModal(event);
        });

        this.formModal.place.value = event.place;
        this.formModal.name.value = this.ctx.userName;
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
        // this.formModal.place.focus();
    }

    openConfirmModal(event) {
        this.confirmModal.open();
        // this.confirmModal.writeOnTitle("Veux tu effacer l'équipe?");
        this.confirmModal.onConfirm(() => {
            this.deleteEvent(event);
        });
    }

    submitEvent(event) {
        if(this.calendar.isEventValid(event) && this.formModal.formIsValid()) {
            this.updateEvent(event);
            this.formModal.animateFlip();       
            let that = this;
            setTimeout(function(){
                that.formModal.close();
            },1000);
        } else {
            this.formModal.onSubmit(() => {
                this.submitEvent(event);
            });
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
        if(this.common.nameFound(event, this.newMainName) && event.names[0] !== this.newMainName) {
            const index = event.names.indexOf(this.newMainName);
            event.names.splice(index, 1);
        }
        event.names[0] = this.newMainName;

        this.calendar.saveEvent(event);
        event.show();
    }

    deleteEvent(event) {
        // this.confirmModal.writeOnFlip("L'équipe est effacée.");
        this.confirmModal.animateFlip();     
        let that = this;
        setTimeout(function(){
            that.confirmModal.close();
        },1000);
        document.getElementById(event.id).remove();
        delete this.calendar.events[event.date][event.id];
        if (Object.values(this.calendar.events[event.date]).length == 0) {
            delete this.calendar.events[event.date];
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

        this.openCreateFormModal(event);
    }
}