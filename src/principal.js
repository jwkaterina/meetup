import { Context } from "./ctx";
import EventModal from "./components/event-modal";


export default class PrincipalCommon {
    constructor(calendar, userName) {
        this.calendar = calendar;
        this.userName = userName;
        this.ctx = Context.getInstance();
        this.eventModal = new EventModal();

        this.loadEventListeners();
    }

    loadEventListeners() {
        this.eventModal.submitButton.addEventListener("click", () => {
            this.addName(this.eventModal);
            this.ctx.currentEvent = null;
        });
        this.eventModal.deleteButton.addEventListener("click", () => {
            this.deleteName(this.eventModal);
            this.ctx.currentEvent = null;
        });
        this.eventModal.cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.eventModal.close();
            this.ctx.currentEvent = null;
        });
    }

    //Used for testing only
    //Must be removed before release in production!
    newName(name) {
        this.userName = name;
    }

    addEventContent(event) {
        let lis = "";
        event.names.forEach((value, index) => {
            lis += `<li class="member" member=${index + 1}>${value}</li>`;
        });

        let txt = "";
        txt = `<a class="place" href="http://maps.google.com/?q=${event.place}" target="_blank">
            <i id="mapIcon" class="fas fa-map"></i>
            ${event.place}
            </a>
            <ol class="list">${lis}</ol>`;
        
        this.eventModal.setContent(txt);
        this.eventModal.setCardColor(event.color);
    }

    addName() {
        const event = this.ctx.currentEvent;
        this.eventModal.writeOnFlip("Bonne prédication!");
        this.eventModal.animateFlip();
        const that = this;
        setTimeout(() => {
            that.eventModal.close();
        },1000);
        event.names.push(this.userName);
        this.calendar.saveEvent(event);
        event.show();
    }

    deleteName() {
        const event = this.ctx.currentEvent;
        if (!event.names.includes(this.userName)) {
            return;
        }
        this.eventModal.writeOnFlip("Ta participation est annulée.");
        this.eventModal.animateFlip();
        const that = this;
        setTimeout(() => {
            that.eventModal.close();
        },1000);
        const index = event.names.indexOf(this.userName);
        event.names.splice(index, 1);
        this.calendar.saveEvent(event);
        event.show();
    }
}