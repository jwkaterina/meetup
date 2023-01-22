import { Context } from "./ctx";
import Event from "./component/event";
import FormModal from "./component/form-modal";
import ConfirmModal from "./component/confirm-modal";
import { dateString, addDays } from "./helper";

export default class PrincipalEditor {
    constructor(calendar, principalCommon) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = principalCommon;
        this.formModal = null;
        this.confirmModal = null;

        this.ctx.usersLoadedPromise.then(() => {
            this.formModal = new FormModal(this.ctx.editors);
            this.confirmModal = new ConfirmModal();
            this.loadEventListeners();
        });
    }

    get user() {
        return this.common.user;
    }

    loadEventListeners() {
        this.common.eventModal.editButton.addEventListener("click", () => {
            this.openChangeFormModal();
            this.common.eventModal.hideModal();
        });

        this.formModal.createButton.addEventListener("click", async () => {
            this.createEvent();
        });
        this.formModal.updateButton.addEventListener("click", async () => {
            console.log("change");
            this.updateEvent();
        });
        this.formModal.deleteButton.addEventListener("click", async () => {
            this.openConfirmModal();
            this.formModal.hideModal();
        });
        this.formModal.cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.formModal.close();
            this.ctx.currentEvent = null;
        });
        this.confirmModal.yesButton.addEventListener("click", async () => {
            this.deleteEvent();
            this.ctx.currentEvent = null;
        });
        this.confirmModal.noButton.addEventListener("click", () => {
            this.confirmModal.close();
            this.ctx.currentEvent = null;
        });
    }

    openEventModal(event) {
        this.ctx.currentEvent = event;
        this.common.eventModal.open();
        this.common.addEventContent(event);
        this.common.eventModal.showEditButton();
        if(!event.memberIds.includes(this.common.user.id)) {
            this.common.eventModal.hideDeleteButton();
            this.common.eventModal.showJoinButton();
            return
        }
        if (this.common.user.id == event.memberIds[0]) {
            this.common.eventModal.hideDeleteButton();
            this.common.eventModal.hideJoinButton();
        } else {
            this.common.eventModal.hideJoinButton();
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
            weekStart: dateString(this.ctx.weekStart),
            place: "",
            start,
            end,
            date,
            memberIds: [],
            color: "var(--green)"
        });
        this.ctx.currentEvent = event;
        this.openCreateFormModal(event);
    }

    openCreateFormModal(event) {
        this.formModal.open();
        this.formModal.writeOnFlip("Ça y est! Le groupe est créé.");
        this.formModal.showCreateButton();
        this.formModal.hideDeleteButton();
        this.formModal.hideUpdateButton();

        this.formModal.place.value = event.place;
        this.formModal.showOptions(this.common.user.id, this.common.user);
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
        this.formModal.place.focus();
    }

    openChangeFormModal() {
        const event = this.ctx.currentEvent;
        this.formModal.open();
        this.formModal.writeOnFlip("Ça y est! Le groupe est changé.");
        this.formModal.showUpdateButton();
        this.formModal.showDeleteButton();
        this.formModal.hideCreateButton();

        this.formModal.place.value = event.place;
        this.formModal.showOptions(event.memberIds[0], this.common.user);
        this.formModal.date.disabled = true;
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
    }

    openConfirmModal() {
        this.confirmModal.open();
    }

    validateEvent(event) {
        if(!this.formModal.formIsValid()) {
            return false;
        }
        try {
            this.calendar.checkEvent(event, this.formModal.newStart, this.formModal.newEnd, this.formModal.newDate);
           
            this.ctx.currentEvent = null;
            return true;
        } catch (e) {
            this.formModal.showError(e.message);
            console.log(e);
            return false;
        }
    }

    async createEvent() {
        const event = this.ctx.currentEvent;
        const isValid = this.validateEvent(event);
        if(isValid) {
            console.log("create");

            event.place = this.formModal.place.value;
            event.start = this.formModal.start.value;
            event.end = this.formModal.end.value;
            event.date = this.formModal.date.value;
    
            const selectedIndex = this.formModal.name.selectedIndex;
            const newMainId = this.formModal.name.options[selectedIndex].dataset.editorId;
            event.memberIds[0] = newMainId;
            try {
                await this.calendar.createEvent(event);
                this.formModal.animateFlip();       
                this.formModal.animateFlip();       
                this.formModal.animateFlip();       
                setTimeout(() => {
                    this.formModal.close();
                },1000);
            } catch (err) {
                console.log(err);
                this.formModal.showError(err.message);
            }
        } else {
            return
        }
    }

    async updateEvent() {
        const event = this.ctx.currentEvent;
        const isValid = this.validateEvent(event);
        if(isValid) {
            event.place = this.formModal.place.value;
            event.start = this.formModal.start.value;
            event.end = this.formModal.end.value;
            event.date = this.formModal.date.value;
    
            const selectedIndex = this.formModal.name.selectedIndex;
            const newMainId = this.formModal.name.options[selectedIndex].dataset.editorId;
            if(event.memberIds.includes(newMainId) && event.memberIds[0] !== newMainId) {
                const index = event.memberIds.indexOf(newMainId);
                event.memberIds.splice(index, 1);
            }
            event.memberIds[0] = newMainId;

            try {
                await this.calendar.updateEvent(event);
                this.formModal.animateFlip();       
                this.formModal.animateFlip();       
                this.formModal.animateFlip();       
                setTimeout(() => {
                    this.formModal.close();
                },1000);
            } catch (err) {
                this.formModal.showError(err);
            }
        } else {
            return
        }
    }

    async deleteEvent() {
        try{
            const id = this.ctx.currentEvent.id;
            const res = await this.calendar.deleteEvent(id);

            if (!res.success) {
                this.formModal.showError("Oops... could not delete the event.");
                return;
            }

            this.confirmModal.animateFlip();     
            this.confirmModal.animateFlip();     
            this.confirmModal.animateFlip();     
            setTimeout(() => {
                this.confirmModal.close();
            },1000);
            document.getElementById(id).remove();
        } catch (err) {
            //TODO: Consider to show the user some friendly message
            console.log("Cannot delete event:", err);
        }
    }

    createNewEvent() {
        const event = new Event({
            weekStart: dateString(this.ctx.weekStart),
            place: "",
            start: "12:00",
            end: "13:00",
            date: dateString(this.ctx.weekStart),
            memberIds: [],
            color: "green",
        });
        this.ctx.currentEvent = event;
        this.openCreateFormModal(event);
    }
}