import { Context } from "./ctx";
import { EventModal } from "./event-modal";
import { PrincipalCommon } from "./principal";


export class User {
    constructor(calendar) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.common = new PrincipalCommon();
        this.eventModal = new EventModal(() => {
            this.eventModal.close();
        });
        this.eventModal.hideEditButton();
    }

    openEventModal(event) {
        this.eventModal.open();
        this.addEventContent(event);
        if (this.common.userFound(event)) {
            this.eventModal.hideSubmitButton();
            this.eventModal.onDelete(() => {
                this.deleteName(event);
            });
        } else {
            this.eventModal.hideDeleteButton();
            this.eventModal.onSubmit(() => {
                this.addName(event);
            });
        }
        
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

    clickSlot(hour, dayIndex) {
     return
    }

    addName(event) {
        this.eventModal.writeOnFlip("Bon predication!");
        this.eventModal.animateFlip();       
        let that = this;
        setTimeout(function(){
            that.eventModal.close();
        },1000);
        event.names.push(this.ctx.userName);
        this.calendar.saveEvent(event);
        event.show();
    }

    deleteName(event) {
        this.eventModal.writeOnFlip("Ta participation est annulé.");
        this.eventModal.animateFlip();     
        let that = this;
        setTimeout(function(){
            that.eventModal.close();
        },1000);
        const userName = this.ctx.userName;
        const user = event.names.find((user) => {return user == userName;});
        const index = event.names.indexOf(user);
        event.names.splice(index, 1);
        this.calendar.saveEvent(event);
        event.show();
    }

    createNewEvent() {
      return
    }
}

