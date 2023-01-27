import { Context } from "./ctx";
import EventModal from "./component/event-modal";


export default class PrincipalCommon {
    constructor(calendar, user) {
        this.calendar = calendar;
        this.user = user;
        this.ctx = Context.getInstance();
        this.eventModal = new EventModal();
        this.loadingAnime = document.getElementById("loading-event");

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
        this.eventModal.disableButtons();
        this.loadingAnime.style.display = "block";

        const event = this.ctx.currentEvent;
        event.memberIds.push(this.user.id);

        try {
            await this.calendar.updateEvent(event);
            this.eventModal.writeOnFlip("Bonne prédication!");
            setTimeout(() => {
                this.loadingAnime.style.display = "none";
                this.eventModal.animateFlip();            
                setTimeout(() => {
                    this.eventModal.close();
                },2000);
            }, 1000);
            event.show();
        } catch (err) {
            this.loadingAnime.style.display = "none";
            this.showSnackbar("Oups! Impossible de s'inscrire...");
            setTimeout(() => {
                this.eventModal.close();
            },1000);   
            console.log("Cannot add user name:", err);
        } 
    }

    async deleteName() {
        this.eventModal.disableButtons();
        this.loadingAnime.style.display = "block";

        const event = this.ctx.currentEvent;
        if (!event.memberIds.includes(this.user.id)) {
            return;
        }

        const index = event.memberIds.indexOf(this.user.id);
        event.memberIds.splice(index, 1);

        try {
            await this.calendar.updateEvent(event);
            this.eventModal.writeOnFlip("Ta participation est annulée.");
            setTimeout(() => {
                this.loadingAnime.style.display = "none";                
                this.eventModal.animateFlip();            
                setTimeout(() => {
                    this.eventModal.close();
                },2000);
            }, 1000);
            event.show();
        } catch (err) {
            this.loadingAnime.style.display = "none";
            this.showSnackbar("Oups! Impossible d'annuler...");
            setTimeout(() => {
                this.eventModal.close();
            },1000);   
            console.log("Cannot delete user name:", err);
        } 
    }

    showSnackbar(text) {
        const snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        snackbar.innerHTML = text;

        setTimeout(function() { 
            snackbar.className = snackbar.className.replace("show", ""); 
        }, 3000);
    }
}