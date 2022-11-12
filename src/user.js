import { EventModal } from "./event-modal.js";
import { Event } from "./event.js";
import { dateString, addDays } from "./helper.js";


export class User {
    constructor(calendar, ctx) {
        this.calendar = calendar;
        this.ctx = ctx;
        this.eventModal = new EventModal(() => {
            this.closeEventModal();
        });
        this.eventModal.hideEditButton();
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
        this.eventModal.fadeIn();
        $("#calendar").addClass("opaque");
        document.querySelector('body').style.overflow = 'hidden';
        if (this.userFound(event)) {
            this.eventModal.hideSubmitButton();
            this.eventModal.onDelete(() => {
                this.deleteName(event);
            });
            console.log("found")
        } else {
            console.log("not found")
            this.eventModal.hideDeleteButton();
            this.eventModal.onSubmit(() => {
                this.submitModal(event);
            });
        }

        this.addEventContent(event);

        
        // if(event.names.length <= 1) {
        //     $("#eventModal").css("backgroundColor", "var(--green");
        // } else {
        //     $("#eventModal").css("backgroundColor", "var(--blue");
        // }
    }

    addEventContent(event) {
        let lis = "";
        event.names.forEach(addToList);
        function addToList(value, index) {
            lis += `<li class="member" member=${index + 1}>${value}</li>`;
        };

        let txt = "";
        txt = `<a class="place" href="http://maps.google.com/?q=${event.place}" target="_blank">
            <i id="mapIcon" class="fas fa-map"></i>
            ${event.place}
            </a>
            <ol class="list">${lis}</ol>`;
        $("#eventContent").html(txt);
    }

    closeEventModal() {
        this.eventModal.close();
        $("#calendar").removeClass("opaque");
        document.querySelector('body').style.overflow = 'auto'; 
    }

    clickSlot(hour, dayIndex) {
     return
    }

    submitModal(event) {
        if (!this.calendar.isEventValid(event)) {
            return;
        }
        this.updateEvent(event);     
        $(".flipCardText").text("Bon predication!");
        this.eventModal.animateFlip();       
        let that = this;
        setTimeout(function(){
            that.closeEventModal();
        },1000);
    }

    updateEvent(event) {
        // this.newName = $("#eventName").val();
        event.names.push(this.ctx.userName);
        this.calendar.saveEvent(event);
        this.calendar.showEvent(event);
    }

    deleteName(event) {
        $(".flipCardText").text("Ta participation est annulé.");
        this.eventModal.animateFlip();     
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

