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
        this.eventModal.joinButton.addEventListener("click", async () => {
            this.addName(this.eventModal);
            this.ctx.currentEvent = null;
        });
        this.eventModal.deleteButton.addEventListener("click", async () => {
            this.deleteName(this.eventModal);
            this.ctx.currentEvent = null;
        });
        this.eventModal.cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.eventModal.close();
            this.ctx.currentEvent = null;
        });
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

    async addName() {
        const event = this.ctx.currentEvent;
        event.memberIds.push(this.user.id);

        try {
            await this.calendar.updateEvent(event);
            this.eventModal.writeOnFlip("Bonne prédication!");
            this.eventModal.animateFlip();       
            setTimeout(() => {
                this.eventModal.close();
            },2000);
            event.show();
        } catch (err) {
            //TODO: Consider to show the user some friendly message
            console.log("Cannot add user name:", err);
        }
    }

    async deleteName() {
        const event = this.ctx.currentEvent;
        if (!event.memberIds.includes(this.user.id)) {
            return;
        }

        const index = event.memberIds.indexOf(this.user.id);
        event.memberIds.splice(index, 1);

        try {
            await this.calendar.updateEvent(event);
            this.eventModal.writeOnFlip("Ta participation est annulée.");
            this.eventModal.animateFlip();       
            setTimeout(() => {
                this.eventModal.close();
            },2000);
            event.show();
        } catch (err) {
            //TODO: Consider to show the user some friendly message
            console.log("Cannot delete user name:", err);
        }
    }
}