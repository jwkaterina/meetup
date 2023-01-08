import { Context } from "./ctx";
import EventModal from "./components/event-modal";


export default class PrincipalCommon {
    constructor(calendar, user) {
        this.calendar = calendar;
        this.user = user;
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
    //TODO: remove before production!
    newName(name) {
        this.user.userName = name;
    }

    addEventContent(event) {
        let lis = "";
        event.members.forEach((member, index) => {
            lis += `<li class="member" member=${index + 1}>${member.userName}</li>`;
        });

        let txt = "";
        txt = `<a class="place" href="http://maps.google.com/?q=${event.place}" target="_blank">
            <i id="mapIcon" class="fa-solid fa-map-location-dot"></i>
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
        setTimeout(() => {
            this.eventModal.close();
        },1000);
        event.members.push({userName: this.user.userName, id: this.user.id});
        this.calendar.saveEvent(event);
        event.show();
    }

    deleteName() {

        const event = this.ctx.currentEvent;
        const ids = event.members.map((member) => member.id);

        if (!ids.includes(this.user.id)) {
            return;
        }
        this.eventModal.writeOnFlip("Ta participation est annulée.");
        this.eventModal.animateFlip();
        setTimeout(() => {
            this.eventModal.close();
        },1000);
        const index = ids.indexOf(this.user.id);
        event.members.splice(index, 1);
        this.calendar.saveEvent(event);
        event.show();
    }
}