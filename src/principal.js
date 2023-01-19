import { Context } from "./ctx";
import EventModal from "./component/event-modal";


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
        this.user.name = name;
    }

    addEventContent(event) {
        let mainName = "???"
        const mainId = event.memberIds[0];         
        if(this.ctx.users[mainId]) {
            mainName = this.ctx.users[mainId].name;
        }

        /*
        * See: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        *
        */
        let lis = "";
        lis = `<li class="member" data-user-id="${mainId}">${mainName}</li>`;
        if(event.memberIds.includes(this.user.id) && this.user.id != mainId) {
            lis += `<li class="member" data-user-id="${this.user.id}">${this.user.name}</li>`;
        }
        event.memberIds.forEach((id) => {
            if(id != mainId && id != this.user.id) {
                let memberName = "???"
                if(this.ctx.users[id]) {
                    memberName = this.ctx.users[id].name;
                }
                lis += `<li class="member" data-user-id="${id}">${memberName}</li>`;
            }
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
        event.memberIds.push(this.user.id);
        this.calendar.saveEvent(event);
        event.show();
    }

    deleteName() {
        const event = this.ctx.currentEvent;
        if (!event.memberIds.includes(this.user.id)) {
            return;
        }
        this.eventModal.writeOnFlip("Ta participation est annulée.");
        this.eventModal.animateFlip();
        setTimeout(() => {
            this.eventModal.close();
        },1000);
        const index = event.memberIds.indexOf(this.user.id);
        event.memberIds.splice(index, 1);
        this.calendar.saveEvent(event);
        event.show();
    }
}