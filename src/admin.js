import { EventModal } from "./event-modal.js";
import { FormModal } from "./form-modal.js";
import { Event } from "./event.js";
import { dateString, addDays} from "./helper.js";

export class Admin {
    constructor(calendar, ctx) {
        this.calendar = calendar;
        this.ctx = ctx;
        this.eventModal = new EventModal(() => {
            this.eventModal.close();
        });
        this.formModal = new FormModal(() => {
            this.formModal.close();
        });
        window.addEventListener("resize", (e) => {
            this.formModal.resize();
          });
    }

    userFound(event) {
        const userName = this.ctx.userName;
        if (event.names.find((user) => {return user == userName;})) {
            return true;
        } else {
            return false;
        }
    }

    openEventModal(event) {
        const userName = this.ctx.userName;
        const user = event.names.find((user) => {return user == userName;});

        this.eventModal.open();
        this.addEventContent(event);
        this.eventModal.onEdit(() => {
            this.eventModal.close();
            this.openChangeFormModal(event);
        })
        if(!this.userFound(event)) {
            this.eventModal.hideDeleteButton();
            this.eventModal.onSubmit(() => {
                this.addName(event);
            });
            return
        }
        if (user == event.names[0]) {
            this.eventModal.hideDeleteButton();
            this.eventModal.hideSubmitButton();
            return
        } else {
            this.eventModal.hideSubmitButton();
            this.eventModal.onDelete(() => {
                this.deleteName(event);
            });
        }

        // if(event.names.length <= 1) {
        //     $("#eventModal").css("backgroundColor", "var(--green");
        // } else {
        //     $("#eventModal").css("backgroundColor", "var(--blue");
        // }
    }

    addEventContent(event) {
        let lis = "";
        event.names.forEach(addToList);
        function addToList(value, index) {
            lis += `<li class="member" member=${index + 1}>${value}</li>`;
        };

        let txt = "";
        txt = `<a class="place" href="http://maps.google.com/?q=${event.place}" target="_blank">
            <i id="mapIcon" class="fas fa-map"></i>
            ${event.place}
            </a>
            <ol class="list">${lis}</ol>`;
        $("#eventContent").html(txt);
    }

    addName(event) {
        this.eventModal.writeOnFlip("Bon predication!");
        this.eventModal.animateFlip();       
        let that = this;
        setTimeout(function(){
            that.eventModal.close();
        },1000);
        event.names.push(this.ctx.userName);
        this.calendar.saveEvent(event);
        this.calendar.showEvent(event);
    }

    deleteName(event) {
        this.eventModal.writeOnFlip("Ta participation est annulé.");
        this.eventModal.animateFlip();     
        let that = this;
        setTimeout(function(){
            that.eventModal.close();
        },1000);
        const userName = this.ctx.userName;
        const user = event.names.find((user) => {return user == userName;});
        const index = event.names.indexOf(user);
        event.names.splice(index, 1);
        this.calendar.saveEvent(event);
        this.calendar.showEvent(event);
    }

    clickSlot(hour, dayIndex) {
        const start = hour.toString().padStart(2, "0") + ":00";
        const end =
            hour < 23
                ? (hour + 1).toString().padStart(2, "0") + ":00"
                : hour.toString().padStart(2, "0") + ":59";

        const date = dateString(addDays(this.calendar.weekStart, dayIndex));
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
        this.formModal.writeOnTitle("Créer l'équipe?");
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
        this.formModal.writeOnTitle("Changer l'équipe?");
        this.formModal.writeOnFlip("Ça y est! L'équipe est changé.");
        this.formModal.onSubmit((() => {
            this.submitEvent(event);
        }), "Changer");
        this.formModal.onDelete(() => {
            this.deleteEvent(event)
        });

        $("#eventPlace").val(event.place);
        $("#eventMainName").val(this.ctx.userName);          
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventPlace").focus();
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
        event.names[0] = this.newMainName;
        event.prevDate = event.date;
        event.start = $("#eventStart").val();
        event.end = $("#eventEnd").val();
        event.date = $("#eventDate").val();
        this.calendar.saveEvent(event);
        this.calendar.showEvent(event);
    }

    deleteEvent(event) {
        this.formModal.writeOnFlip("L'équipe est annulé.");
        this.formModal.animateFlip();       
        let that = this;
        setTimeout(function(){
            that.formModal.close();
        },1000);        $(`#${event.id}`).remove();
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
            date: dateString(this.calendar.weekStart),
            names: [],
            color: "green",
        });

        this.openCreateFormModal(event);
    }
}