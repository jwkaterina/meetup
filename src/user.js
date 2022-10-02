import { Event } from "./event.js";
import { dateString, addDays } from "./helper.js";
import { MODE } from "./ctx.js";



export class User {
    constructor(weekStart, ctx, userName) {
        this.weekStart = weekStart;
        this.ctx = ctx;
        this.newName = "";
        this.userName = userName;
    }

    get validateEvent() {
        return false;
    }

    openModal(calendar, event) {
        if(this.ctx.mode == MODE.CREATE) {
            this.ctx.mode = MODE.VIEW;
            return;
        } else if(this.ctx.mode == MODE.UPDATE) {
            $("#modalTitle").text("Veux-tu prêcher avec cette équipe?");
            $("#eventName")
                .show()
                .val(this.userName);
            $("#eventDate").hide();
            $("#eventStart").hide();
            $("#eventEnd").hide();
            // event.color = "var(--blue)";
            $("#submitButton").val("S'inscrire");
            $("#deleteButton")
                .val("Annuler")
                .show()
                .off("click")
                .click(() => calendar.deleteName(event));
        }

        $("#eventModal").fadeIn(200);
        $("#eventName").focus();
        $("#calendar").addClass("opaque");
    }

    submitModal() {
        $("#flipCardText").text("Bon predication!");
        $(".flip-card-inner").addClass("flip");
            setTimeout(function() {
                $(".flip-card-inner").removeClass("flip");
            },1000);
    }

    closeModal() {
        $("#eventModal").fadeOut(200);
        $("#errors").text("");
        $("#calendar").removeClass("opaque");
        this.ctx.mode = MODE.VIEW;

        document.querySelector('body').style.overflow = 'auto';
        $("#submitButton").unbind("click");
    }

    updateEvent(event) {
        this.newName = $("#eventName").val();
        event.name.push(this.newName);
    }

    createNewEvent() {
      return null;
    }

}

