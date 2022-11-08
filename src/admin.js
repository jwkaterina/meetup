import { Event } from "./event.js";
import { dateString, addDays} from "./helper.js";
import { MODE } from "./ctx.js";


export class Admin {
    constructor(weekStart, ctx, userName) {
        this.weekStart = weekStart;
        this.ctx = ctx;
        this.userName = userName;
    }

    get validateEvent() {
        return true;
    }

    clickSlot(hour, dayIndex) {
        if (this.ctx.mode != MODE.VIEW) return;
        this.ctx.mode = MODE.CREATE;
        const start = hour.toString().padStart(2, "0") + ":00";
        const end =
            hour < 23
                ? (hour + 1).toString().padStart(2, "0") + ":00"
                : hour.toString().padStart(2, "0") + ":59";

        const date = dateString(addDays(this.weekStart, dayIndex));
        const event = new Event({
            place: "",
            start,
            end,
            date,
            name: [],
            color: "var(--green)"
        });
        this.openCreateFormModal(event);
    }

    // openFormModal(event) {
    //     const addOnclickListener = this.ctx.principal.openFormModal(this, event);
    //     document.querySelector('body').style.overflow = 'hidden';
    //     if(addOnclickListener) {
    //         $("#submitButton")
    //         .off("submit")
    //         .click((e) => {
    //             e.preventDefault();
    //             this.submitModal(event);
    //         });
    //     }
    // }

    openCreateFormModal(event) {
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
        $("#adminCreateFormModal").fadeIn(200);
        $("#submitButton")
            .off("submit")
            .click((e) => {
                e.preventDefault();
                this.submitModal(event, "#adminCreateFormModal");
            });

        $("#eventPlace").val(event.place);
        $("#eventName").val(this.userName);          
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventPlace").focus();
        // return true;
    }

    openChangeFormModal(event) {
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
        $("#adminChangeFormModal").fadeIn(200);
        $("#submitButton")
            .off("submit")
            .click((e) => {
                e.preventDefault();
                this.submitModal(event, "#adminChangeFormModal");
            });
        $("#deleteButton")
            .off("click")
            .click(() => this.deleteEvent(event));

        $("#eventPlace").val(event.place);
        $("#eventName").val(this.userName);          
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventPlace").focus();
    }

    submitModal(event, modal) {
        if (!calendar.isEventValid(event)) {
            return;
        }
        this.updateEvent(event);
        document.getElementById(modal).querySelector(".flip-card-inner").addClass("flip");
        setTimeout(function() {
            document.getElementById(modal).querySelector(".flip-card-inner").removeClass("flip");
        },1000);        
        let that = this;
        setTimeout(function(){
            that.closeFormModal(modal);
        },1000);
    }

    closeFormModal(modal) {
        $(modal).fadeOut(200);
        $("#errors").text("");
        $("#calendar").removeClass("opaque");
        this.ctx.mode = MODE.VIEW;

        document.querySelector('body').style.overflow = 'auto';
        // $("#submitButton").unbind("click");
    }

    updateEvent(event) {
        event.place = $("#eventPlace").val();
        this.newName = $("#eventName").val();
        event.name[0] = this.newName;
        event.prevDate = event.date;
        event.start = $("#eventStart").val();
        event.end = $("#eventEnd").val();
        event.date = $("#eventDate").val();
        calendar.saveEvent(event);
        calendar.showEvent(event);
    }

    deleteEvent(event) {
        this.closeFormModal("#adminChangeFormModal");
        $(`#${event.id}`).remove();
        delete this.events[event.date][event.id];
        if (Object.values(this.events[event.date]).length == 0) {
            delete this.events[event.date];
        }
        this.saveEvents();
    }

    createNewEvent() {
        if (this.ctx.mode != MODE.VIEW) return null;
        this.ctx.mode = MODE.CREATE;
        const event = new Event({
            start: "12:00",
            end: "13:00",
            date: dateString(this.weekStart),
            name: [],
            color: "green",
        });

        this.openCreateFormModal(event);
    }
}