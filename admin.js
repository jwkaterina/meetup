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

    openModal(calendar, event) {
        $("#eventName").hide();            
        $("#eventDate")
            .show()
            .val(event.date);
        $("#eventStart")
            .show()
            .val(event.start);
        $("#eventEnd")
            .show()
            .val(event.end);
        if (this.ctx.mode == MODE.UPDATE) {
            $("#modalTitle").text("Changer l'équipe?");
            $("#submitButton").val("Changer");
            $("#deleteButton")
                .val("Effacer")
                .show()
                .off("click")
                .click(() => calendar.deleteEvent(event));
        } else if (this.ctx.mode == MODE.CREATE) {
            $("#modalTitle").text("Créer l'équipe?");
            // event.color = "var(--green)";
            event.name = [];
            $("#submitButton").val("Creer");
            $("#deleteButton").hide();
        }

        $("#eventModal").fadeIn(200);
        $("#eventDate").focus();
        $("#calendar").addClass("opaque");
    }

    submitModal() {
        $("#flipCardText").text("Ça y est!");
        $(".flip-card-inner").addClass("flip");
            setTimeout(function() {
                $(".flip-card-inner").removeClass("flip");
            },1000);
    }

    updateEvent(event) {
        event.prevDate = event.date;
        event.start = $("#eventStart").val();
        event.end = $("#eventEnd").val();
        event.date = $("#eventDate").val();
    }

    closeModal() {
        $("#eventModal").fadeOut(200);
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