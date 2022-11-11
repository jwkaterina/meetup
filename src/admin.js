import { Event } from "./event.js";
import { dateString, addDays} from "./helper.js";

export class Admin {
    constructor(calendar, ctx) {
        this.calendar = calendar;
        this.ctx = ctx;
    }

    get validateEvent() {
        return true;
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
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
        $("#adminFormModal").fadeIn(200);
        $(".modalTitle").text("Créer l'équipe?");
        $(".submitButton")
            .val("Creer")
            .off("click")
            .click((e) => {
                e.preventDefault();
                this.submitModal(event);
            });
        $(".deleteButton")
            .hide();
        $(".cancelButton")
            .off("click")
            .click((e) => {
                e.preventDefault();
                this.closeFormModal();
            });

        $("#eventPlace").val(event.place);
        $("#eventMainName").val(this.ctx.userName);          
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventPlace").focus();
    }

    openChangeFormModal(event) {
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
        $("#adminFormModal").fadeIn(200);
        $(".modalTitle").text("Changer l'équipe?");
        $(".submitButton")
            .val("Changer")
            .off("click")
            .click((e) => {
                e.preventDefault();
                this.submitModal(event);
            });
        $(".deleteButton")
            .show()
            .off("click")
            .click(() => this.deleteEvent(event));
        $(".cancelButton")
            .off("click")
            .click((e) => {
                e.preventDefault();
                this.closeFormModal();
            });

        $("#eventPlace").val(event.place);
        $("#eventMainName").val(this.ctx.userName);          
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventPlace").focus();
    }

    submitModal(event) {
        if (!this.calendar.isEventValid(event)) {
            return;
        }
        this.updateEvent(event);
        document.getElementById("adminFormModal").querySelector(".flip-card-inner").classList.add("flip");
        setTimeout(function() {
            document.getElementById("adminFormModal").querySelector(".flip-card-inner").classList.remove("flip");
        },1000);        
        let that = this;
        setTimeout(function(){
            that.closeFormModal();
        },1000);
    }

    closeFormModal() {
        $("#adminFormModal").fadeOut(200);
        $("#errors").text("");
        $("#calendar").removeClass("opaque");

        document.querySelector('body').style.overflow = 'auto';
        // $("#submitButton").unbind("click");
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
        this.closeFormModal("#adminFormModal");
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
            date: dateString(this.calendar.weekStart),
            names: [],
            color: "green",
        });

        this.openCreateFormModal(event);
    }
}