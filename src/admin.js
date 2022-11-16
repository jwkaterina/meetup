import { Context } from "./ctx";
import { Event } from "./event";
import { FormModal } from "./form-modal";
import { ConfirmModal } from "./confirm-modal";
import { EventModal } from "./event-modal";
import { dateString, addDays} from "./helper";
import { PrincipalCommon } from "./principal";

export class Admin {
    constructor(calendar) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = new PrincipalCommon();
        this.eventModal = new EventModal(() => {
            this.eventModal.close();
        });
        this.formModal = new FormModal(() => {
            this.formModal.close();
        });
        this.confirmModal = new ConfirmModal(() => {
            this.confirmModal.close();
        });
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
        // this.formModal.writeOnTitle("Créer l'équipe?");
        this.formModal.writeOnFlip("Ça y est! L'équipe est crée.");
        this.formModal.onSubmit((() => {
            this.submitEvent(event);
        }), "Creer");
        this.formModal.hideDeleteButton();

        $("#eventPlace").val(event.place);
        $("#eventMainName").val(this.ctx.userName);          
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventPlace").focus();
    }

    openChangeFormModal(event) {
        this.formModal.open();
        // this.formModal.writeOnTitle("Changer l'équipe?");
        this.formModal.writeOnFlip("Ça y est! L'équipe est changé.");
        this.formModal.onSubmit((() => {
            this.submitEvent(event);
        }), "Changer");
        this.formModal.onDelete(() => {
            this.formModal.close();
            this.openConfirmModal(event);
        });

        $("#eventPlace").val(event.place);
        $("#eventMainName").val(this.ctx.userName);          
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventPlace").focus();
    }

    openConfirmModal(event) {
        this.confirmModal.open();
        // this.confirmModal.writeOnTitle("Veux tu effacer l'équipe?");
        // this.confirmModal.writeOnFlip("Ça y est! L'équipe est effacée.");
        this.confirmModal.onDelete(() => {
            this.deleteEvent(event);
        });
    }

    submitEvent(event) {
        if (!this.calendar.isEventValid(event)) {
            return;
        }
        this.updateEvent(event);       
        this.formModal.animateFlip();       
        let that = this;
        setTimeout(function(){
            that.formModal.close();
        },1000);
    }

    updateEvent(event) {
        event.place = $("#eventPlace").val();
        this.newMainName = $("#eventMainName").val();
        if(this.common.nameFound(event, this.newMainName) && event.names[0] !== this.newMainName) {
            const index = event.names.indexOf(this.newMainName);
            event.names.splice(index, 1);
        }
        event.names[0] = this.newMainName;
        event.prevDate = event.date;
        event.start = $("#eventStart").val();
        event.end = $("#eventEnd").val();
        event.date = $("#eventDate").val();
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
        $(`#${event.id}`).remove();
        delete this.calendar.events[event.date][event.id];
        if (Object.values(this.calendar.events[event.date]).length == 0) {
            delete this.calendar.events[event.date];
        }
        this.calendar.saveEvents();
    }

    createNewEvent() {
        const event = new Event({
            start: "12:00",
            end: "13:00",
            date: dateString(this.ct.weekStart),
            names: [],
            color: "green",
        });

        this.openCreateFormModal(event);
    }
}