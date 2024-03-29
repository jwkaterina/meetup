import { Context } from "./ctx";
import Event from "./component/event";
import ValidationError from "./error/validation-error";
import FormModal from "./component/form-modal";
import ConfirmModal from "./component/confirm-modal";
import CustomSelect from "./component/form-modal-select-custom";
import { dateString, addDays } from "./helper";
import "./component/snackbar";

export default class PrincipalEditor {
    constructor(calendar, principalCommon) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = principalCommon;
        this.formModal = null;
        this.confirmModal = null;
        this.customSelect = null;
        this.snackbar = document.querySelector("snack-bar");
        this.loadingAnime = document.getElementById("loading-form");

        this.ctx.usersLoadedPromise.then(() => {
            this.formModal = FormModal.build();
            this.customSelect = new CustomSelect(this.ctx.editors, this.formModal.customSelectContainer);
            this.confirmModal = ConfirmModal.build();
            this.loadEventListeners();
        });
    }

    get user() {
        return this.common.user;
    }

    set user(newUser) {
        this.common.user = newUser;
    }

    loadEventListeners() {
        this.common.eventModal.editButton.addEventListener("click", () => {
            this.openChangeFormModal();
            this.common.eventModal.hideModal();
        });

        this.formModal.createButton.addEventListener("click", () => {
            (async () => {
                try {
                    await this.createEvent();
                } catch (err) {
                    console.log('Cannot create Event: ', err);
                }
            })();
        });
        this.formModal.updateButton.addEventListener("click", () => {
            (async () => {
                try {
                    await this.updateEvent();
                } catch (err) {
                    console.log('Cannot update Event: ', err);
                }
            })();
        });
        this.formModal.deleteButton.addEventListener("click", async () => {
            this.openConfirmModal();
            this.formModal.hideModal();
        });
        this.formModal.cancelButton.addEventListener("click", (e) => {
            this.formModal.close();
            this.ctx.currentEvent = null;
        });
        this.confirmModal.yesButton.addEventListener("click", () => {
            (async () => {
                try {
                    await this.deleteEvent();
                    this.ctx.currentEvent = null;
                } catch (err) {
                    console.log('Cannot delete Event: ', err);
                }
            })();
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
                ? (hour + 1).toString().padStart(2, "0") + ":30"
                : "23:59";

        const date = dateString(addDays(this.ctx.weekStart, dayIndex));
        const event = new Event({
            weekStart: dateString(this.ctx.weekStart),
            place: "",
            start,
            end,
            date,
            memberIds: [],
            color: "",
            type: "",
            comment: ""
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
        this.customSelect.showOptions(this.user.id, this.user);
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
        this.formModal.comment.value = event.comment;
    }

    openChangeFormModal() {
        const event = this.ctx.currentEvent;
        this.formModal.open();
        this.formModal.writeOnFlip("Ça y est! Le groupe est changé.");
        this.formModal.showUpdateButton();
        this.formModal.showDeleteButton();
        this.formModal.hideCreateButton();

        this.formModal.place.value = event.place;
        this.customSelect.showOptions(event.memberIds[0], this.user);
        this.formModal.date.disabled = true;
        this.formModal.date.value = event.date;
        this.formModal.start.value = event.start;
        this.formModal.end.value = event.end;
        if(event.comment) {
            this.formModal.comment.value = event.comment;
        } 
        if(event.type) {
            this.formModal.types.forEach(type => {
                if(type.value === event.type) {
                    type.checked = true;
                }
            })
        } else {
            this.formModal.types.forEach(type => {
                if(type.value === "pm") {
                    type.checked = true;
                }
            })
        }
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
            return true;
        } catch (e) {
            if (e instanceof ValidationError) {
                this.formModal.showError(e.message);
            } else {
                this.snackbar.show("Oups! Quelque chose s'est mal passé...");
                setTimeout(() => {
                    this.formModal.close();
                },1000);
                console.log(e);
            }
            return false;
        } 
    }

    async createEvent() {        
        const event = this.ctx.currentEvent;
        const isValid = this.validateEvent(event);
        if(isValid) {
            this.formModal.disableButtons();
            this.loadingAnime.style.display = "block";

            event.start = this.formModal.start.value;
            event.end = this.formModal.end.value;
            event.date = this.formModal.date.value;
            event.comment = this.formModal.comment.value;
            this.formModal.types.forEach(type => {
                if(type.checked) {
                    event.type = type.value;
                }
            })    

            if(event.type === "zoom") {
                event.place = "Zoom";
            } else {
                event.place = this.formModal.place.value;
            }

            const newMainId = this.customSelect.select.selectedEditorId;
            event.memberIds[0] = newMainId;
            try {
                await this.calendar.createEvent(event);
                setTimeout(() => {
                    this.loadingAnime.style.display = "none";
                    this.formModal.animateFlip();            
                    setTimeout(() => {
                        this.formModal.close();
                    },1500);
                }, 500);
            } catch (err) {
                this.loadingAnime.style.display = "none";
                this.snackbar.show("Oups! Impossible de créer un groupe...");
                setTimeout(() => {
                    this.formModal.close();
                },1000);
                console.log(err);
            } 
        } else {
            return
        }
    }

    async updateEvent() {
        const event = this.ctx.currentEvent;
        const isValid = this.validateEvent(event);
        if(isValid) {
            this.formModal.disableButtons();
            this.loadingAnime.style.display = "block";

            event.start = this.formModal.start.value;
            event.end = this.formModal.end.value;
            event.date = this.formModal.date.value;
            event.date = this.formModal.date.value;
            event.comment = this.formModal.comment.value;

            this.formModal.types.forEach(type => {
                if(type.checked) {
                    event.type = type.value;
                }
            });

            if(event.type === "zoom") {
                event.place = "Zoom";
            } else {
                event.place = this.formModal.place.value;
            }

            if(event.type === "tr") {
                event.color = "var(--blue)";
            } else if(event.type === "pm") {
                event.color = "var(--green)";
            } else {
                event.color = "var(--gray-base)";
            }
    
            const newMainId = this.customSelect.select.selectedEditorId;
            if(event.memberIds.includes(newMainId) && event.memberIds[0] !== newMainId) {
                const index = event.memberIds.indexOf(newMainId);
                event.memberIds.splice(index, 1);
            }
            event.memberIds[0] = newMainId;

            try {
                await this.calendar.updateEvent(event);
                setTimeout(() => {
                    this.loadingAnime.style.display = "none";
                    this.formModal.animateFlip();            
                    setTimeout(() => {
                        this.formModal.close();
                    },1500);
                }, 500);
             
            } catch (err) {
                this.loadingAnime.style.display = "none";
                this.snackbar.show("Oups! Impossible de changer un groupe...");
                setTimeout(() => {
                    this.formModal.close();
                },1000);
                console.log(err);
            }
        } else {
            return
        }
    }

    async deleteEvent() {
        this.confirmModal.disableButtons();
        this.loadingAnime.style.display = "block";

        try{
            const id = this.ctx.currentEvent.id;
            const res = await this.calendar.deleteEvent(id);

            if (!res.success) {
                this.loadingAnime.style.display = "none";
                this.snackbar.show("Oups! Impossible d'effacer un groupe...");
                setTimeout(() => {
                    this.confirmModal.close();
                },1000);
                return;
            }
   
            setTimeout(() => {
                this.loadingAnime.style.display = "none";
                this.confirmModal.animateFlip();            
                setTimeout(() => {
                    this.confirmModal.close();
                },1500);
            }, 500);
            document.getElementById(id).remove();
        } catch (err) {
            this.loadingAnime.style.display = "none";
            this.snackbar.show("Oups! Impossible d'effacer un groupe...");
            setTimeout(() => {
                this.confirmModal.close();
            },1000);            
            console.log("Cannot delete event:", err);
        } 
    }

    createNewEvent() {
        const event = new Event({
            weekStart: dateString(this.ctx.weekStart),
            place: "",
            start: "12:00",
            end: "13:30",
            date: dateString(this.ctx.weekStart),
            memberIds: [],
            color: "",
            type: "",
            comment: ""
        });
        this.ctx.currentEvent = event;
        this.openCreateFormModal(event);
    }
}