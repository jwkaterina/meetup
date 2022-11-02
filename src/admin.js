import { Event } from "./event.js";
import { dateString } from "./helper.js";
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

    openFormModal(calendar, event) {
        if (this.ctx.mode == MODE.UPDATE) {
            $("#adminChangeFormModal").fadeIn(200);
            $("#deleteButton")
                .off("click")
                .click(() => calendar.deleteEvent(event));
        } else if (this.ctx.mode == MODE.CREATE) {
            $("#adminCreateFormModal").fadeIn(200);
        }

        $("#eventPlace").val(event.place);
        $("#eventName").val(this.userName);          
        $("#eventDate").val(event.date);
        $("#eventStart").val(event.start);
        $("#eventEnd").val(event.end);
        $("#eventPlace").focus();
        $("#calendar").addClass("opaque");
        return true;
    }

    submitModal() {
        $(".flip-card-inner").addClass("flip");
            setTimeout(function() {
                $(".flip-card-inner").removeClass("flip");
            },1000);
    }

    updateEvent(event) {
        event.place = $("#eventPlace").val();
        this.newName = $("#eventName").val();
        event.name[0] = this.newName;
        event.prevDate = event.date;
        event.start = $("#eventStart").val();
        event.end = $("#eventEnd").val();
        event.date = $("#eventDate").val();
    }

    closeFormModal() {
        $("#formModal").fadeOut(200);
        $("#errors").text("");
        $("#calendar").removeClass("opaque");
        this.ctx.mode = MODE.VIEW;

        document.querySelector('body').style.overflow = 'auto';
        $("#submitButton").unbind("click");
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

        return event;
    }
}