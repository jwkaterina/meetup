import { Context } from "./ctx";
import { Event } from "./components/event";
import { EventModal } from "./components/event-modal";


export class PrincipalCommon {
    constructor(calendar) {
        this.calendar = calendar;
        this.ctx = Context.getInstance();
        this.eventModal = new EventModal();


        this.eventModal.submitButton.addEventListener("click", () => {
            this.addName(this.eventModal);
            this.ctx.currentEvent = null;
            console.log(this.ctx.currentEvent);
        });
        this.eventModal.deleteButton.addEventListener("click", () => {
            this.deleteName(this.eventModal);
            this.ctx.currentEvent = null;
            console.log(this.ctx.currentEvent);
        });
        this.eventModal.cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.eventModal.close();
            this.ctx.currentEvent = null;
            console.log(this.ctx.currentEvent);
        });
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
        document.getElementById("eventContent").innerHTML = txt;
        const eventModal = document.getElementById("eventModal");
        eventModal.querySelector(".flip-card-front").style.background = event.color;
        eventModal.querySelector(".flip-card-back").style.background = event.color;
    }

    addName() {
        const event = this.ctx.currentEvent;
        this.eventModal.writeOnFlip("Bon predication!");
        this.eventModal.animateFlip();
        const that = this;
        setTimeout(() => {
            that.eventModal.close();
        },1000);
        event.names.push(this.ctx.userName);
        this.calendar.saveEvent(event);
        event.show();
    }

    deleteName() {
        const event = this.ctx.currentEvent;
        this.eventModal.writeOnFlip("Ta participation est annulé.");
        this.eventModal.animateFlip();
        const that = this;
        setTimeout(() => {
            that.eventModal.close();
        },1000);
        const index = event.names.indexOf(this.ctx.userName);
        event.names.splice(index, 1);
        this.calendar.saveEvent(event);
        event.show();
    }
}