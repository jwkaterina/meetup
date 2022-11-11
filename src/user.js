import { Event } from "./event.js";
import { dateString, addDays } from "./helper.js";


export class User {
    constructor(calendar, ctx) {
        this.calendar = calendar;
        this.ctx = ctx;
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
        $("#userFormModal").fadeIn(200);
        $(".modalTitle").text("Veux-tu prêcher avec cette équipe?");
        $(".flipCardText").text("Bon predication!");
        $(".submitButton")
            .val("S'inscrire")
            .off("click")
            .click((e) => {
                e.preventDefault();
                this.submitModal(event);
            });
        $(".deleteButton")
            .off("click")
            .click(() => this.deleteName(event));
        $(".cancelButton")
            .off("click")
            .click((e) => {
                e.preventDefault();
                this.closeFormModal();
            });

        $("#eventName").focus();
        $("#eventName").val(this.ctx.userName);
           
    }
    

    submitModal(event) {
        if (!this.calendar.isEventValid(event)) {
            return;
        }
        this.updateEvent(event);     
        document.getElementById("userFormModal").querySelector(".flip-card-inner").classList.add("flip");
        setTimeout(function() {
            document.getElementById("userFormModal").querySelector(".flip-card-inner").classList.remove("flip");
        },1000);        
        let that = this;
        setTimeout(function(){
            that.closeFormModal();
        },1000);
    }

    closeFormModal() {
        $("#userFormModal").fadeOut(200);
        $("#errors").text("");
        $("#calendar").removeClass("opaque");

        document.querySelector('body').style.overflow = 'auto';
    }

    updateEvent(event) {
        this.newName = $("#eventName").val();
        event.names.push(this.newName);
        this.calendar.saveEvent(event);
        this.calendar.showEvent(event);
    }

    deleteName(event) {
        $(".flipCardText").text("Ta participation est annulé.");
        document.getElementById("userFormModal").querySelector(".flip-card-inner").classList.add("flip");
        setTimeout(function() {
            document.getElementById("userFormModal").querySelector(".flip-card-inner").classList.remove("flip");
        },1000);        
        let that = this;
        setTimeout(function(){
            that.closeFormModal();
        },1000);        event.names.pop(event);
        this.calendar.saveEvent(event);
        this.calendar.showEvent(event);
    }

    createNewEvent() {
      return
    }

}

