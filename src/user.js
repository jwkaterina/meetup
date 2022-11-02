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

    openFormModal(calendar, event) {
        if(this.ctx.mode == MODE.CREATE) {
            this.ctx.mode = MODE.VIEW;
            return false;
        } else if(this.ctx.mode == MODE.UPDATE) {
            $("#eventName").val(this.userName);
            // event.color = "var(--blue)";
            $("#deleteButton")
                .off("click")
                .click(() => calendar.deleteName(event));
        }

        $("#userChangeFormModal").fadeIn(200);
        $("#eventName").focus();
        $("#calendar").addClass("opaque");
        return true;
    }

    submitModal() {
        $(".flip-card-inner").addClass("flip");
            setTimeout(function() {
                $(".flip-card-inner").removeClass("flip");
            },1000);
    }

    closeFormModal() {
        $("#formModal").fadeOut(200);
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

