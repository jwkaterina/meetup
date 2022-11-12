import { Event } from "./event.js";
import { dateString, addDays } from "./helper.js";


export class User {
    constructor(calendar, ctx) {
        this.calendar = calendar;
        this.ctx = ctx;
        this.eventModal = $("#eventModal");

        $(".editButton").hide();

        this.cancelButton = this.eventModal.find(".cancelButton");
        this.cancelButton.click((e) => {
            e.preventDefault();
            this.closeEventModal(event);
        });
    }

    userFound(event) {
        const userName = this.ctx.userName;
        // console.log(event.names.find((user) => {return user == userName;}));
        if (event.names.find((user) => {return user == userName;})) {
            return true;
        } else {
            return false;
        }
    }

    openEventModal(event) {
        this.eventModal.fadeIn(200);
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
        if (this.userFound(event)) {
            $(".submitButton").hide();
            $(".deleteButton")
                .show()
                .off("click")
                .click((e) => {
                    e.preventDefault();
                    this.deleteName(event);
                });
            console.log("found")
        } else {
            console.log("not found")
            $(".deleteButton").hide();
            $(".submitButton")
                .show()
                .off("click")
                .click((e) => {
                    e.preventDefault();
                    this.submitModal(event);
                });
        }

        let lis = "";
        event.names.forEach(addToList)
        function addToList(value, index) {
            lis += `<li class="member" member=${index + 1}>${value}</li>`
        };

        let txt = "";
        txt = `<a class="place" href="http://maps.google.com/?q=${event.place}" target="_blank">
            <i id="mapIcon" class="fas fa-map"></i>
            ${event.place}
            </a>
            <ol class="list">${lis}</ol>`
        $("#eventContent").html(txt);

        
        // if(event.names.length <= 1) {
        //     $("#eventModal").css("backgroundColor", "var(--green");
        // } else {
        //     $("#eventModal").css("backgroundColor", "var(--blue");
        // }
    }

    closeEventModal() {
        this.eventModal.fadeOut(200);
        $("#errors").text("");
        $("#calendar").removeClass("opaque");
        document.querySelector('body').style.overflow = 'auto';
    }

    clickSlot(hour, dayIndex) {
     return
    }

    // openChangeFormModal(event) {
    //     $("#calendar").addClass("opaque");
    //     document.querySelector('body').style.overflow = 'hidden';
    //     $("#userFormModal").fadeIn(200);
    //     $(".modalTitle").text("Veux-tu prêcher avec cette équipe?");
    //     $(".flipCardText").text("Bon predication!");
    //     $(".submitButton")
    //         .val("S'inscrire")
    //         .off("click")
    //         .click((e) => {
    //             e.preventDefault();
    //             this.submitModal(event);
    //         });
    //     $(".deleteButton")
    //         .off("click")
    //         .click(() => this.deleteName(event));
    //     $(".cancelButton")
    //         .off("click")
    //         .click((e) => {
    //             e.preventDefault();
    //             this.closeFormModal();
    //         });

    //     $("#eventName").focus();
    //     $("#eventName").val(this.ctx.userName);
    // }
    

    submitModal(event) {
        if (!this.calendar.isEventValid(event)) {
            return;
        }
        this.updateEvent(event);     
        $(".flipCardText").text("Bon predication!");
        document.getElementById("eventModal").querySelector(".flip-card-inner").classList.add("flip");
        setTimeout(function() {
            document.getElementById("eventModal").querySelector(".flip-card-inner").classList.remove("flip");
        },1000);        
        let that = this;
        setTimeout(function(){
            that.closeEventModal();
        },1000);
    }

    // closeFormModal() {
    //     $("#userFormModal").fadeOut(200);
    //     $("#errors").text("");
    //     $("#calendar").removeClass("opaque");

    //     document.querySelector('body').style.overflow = 'auto';
    // }

    updateEvent(event) {
        // this.newName = $("#eventName").val();
        event.names.push(this.ctx.userName);
        this.calendar.saveEvent(event);
        this.calendar.showEvent(event);
    }

    deleteName(event) {
        $(".flipCardText").text("Ta participation est annulé.");
        document.getElementById("eventModal").querySelector(".flip-card-inner").classList.add("flip");
        setTimeout(function() {
            document.getElementById("eventModal").querySelector(".flip-card-inner").classList.remove("flip");
        },1000);        
        let that = this;
        setTimeout(function(){
            that.closeEventModal();
        },1000);
        const userName = this.ctx.userName;
        const user = event.names.find((user) => {return user == userName;});
        const index = event.names.indexOf(user);
        event.names.splice(index, 1);
        // console.log(user, index);
        this.calendar.saveEvent(event);
        this.calendar.showEvent(event);
    }

    createNewEvent() {
      return
    }

}

