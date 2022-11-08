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

    clickSlot(hour, dayIndex) {
     return
    }

    openChangeFormModal(event) {
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
        $("#userChangeFormModal").fadeIn(200);
        $("#submitButton")
            .off("submit")
            .click((e) => {
                e.preventDefault();
                this.submitModal(event, "#userChangeFormModal");
            });
        $("#deleteButton")
            .off("click")
            .click(() => this.deleteName(event));
        $("#eventName").focus();
        $("#eventName").val(this.userName);
           
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
        this.newName = $("#eventName").val();
        event.name.push(this.newName);
        calendar.saveEvent(event);
        calendar.showEvent(event);
    }

    deleteName(event) {
        this.closeFormModal("#userChangeFormModal");
        event.name.pop(event);
        this.saveEvent(event);
        this.showEvent(event);
    }

    createNewEvent() {
      return
    }

}

