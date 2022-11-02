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
        $("#eventPlace")
            .show()
            .val(event.place);
        $("#eventName")
            // .hide();
            .show()
            .val(this.userName);          
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
            $("#submitButton").val("Creer");
            $("#deleteButton").hide();
        }

        $("#formModal").fadeIn(200);
        $("#eventDate").focus();
        $("#calendar").addClass("opaque");
        return true;
    }

    submitModal() {
        $("#flipCardText").text("Ça y est!");
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