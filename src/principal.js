import { Context } from "./ctx";
import "./component/snackbar";
import EventModal from "./component/event-modal";
import PathJumper from "./service/path-jumper";

export default class PrincipalCommon {
    constructor(calendar, user) {
        this.calendar = calendar;
        this.user = user;
        this.ctx = Context.getInstance();
        this.eventModal = EventModal.build();
        this.snackbar = document.querySelector("snack-bar");
        this.loadingAnime = document.getElementById("loading-event");

        this.loadEventListeners();
    }

    loadEventListeners() {
        this.eventModal.joinButton.addEventListener("click", () => {
            (async () => {
                try {
                    await this.addName(this.eventModal);
                    this.ctx.currentEvent = null;
                } catch (err) {
                    console.log('Cannot add name: ', err);
                }
            })();
        });
        this.eventModal.deleteButton.addEventListener("click", () => {
            (async () => {
                try {
                    await this.deleteName(this.eventModal);
                    this.ctx.currentEvent = null;
                } catch (err) {
                    console.log('Cannot delete name: ', err);
                }
            })();
        });
        this.eventModal.cancelButton.addEventListener("click", (e) => {
            this.eventModal.close();
            this.ctx.currentEvent = null;
        });
        this.eventModal.shareButton.addEventListener("click", (e) => {
            (async () => {
                try {
                    await this.writeMessage();
                } catch (err) {
                    console.log('Cannot copy link to clipboard: ', err);
                }
            })();
        });
    }

    addEventContent(event) {
        let mainName = "???"
        const mainId = event.memberIds[0];         
        if(this.ctx.users[mainId]) {
            mainName = this.ctx.users[mainId].name;
        }

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
        txt = `<ol class="list">${lis}</ol>`;

        this.eventModal.setTime(event.date, event.start, event.end);
        this.eventModal.setPlace(event.place, event.type);
        this.eventModal.setMembers(txt);
        this.eventModal.setCardColor(event.color);
        this.eventModal.setComment(event.comment);
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
                },1500);
            }, 500);
            event.show();
        } catch (err) {
            this.loadingAnime.style.display = "none";
            this.snackbar.show("Oups! Impossible de s'inscrire...");
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
                },1500);
            }, 500);
            event.show();
        } catch (err) {
            this.loadingAnime.style.display = "none";
            this.snackbar.show("Oups! Impossible d'annuler...");
            setTimeout(() => {
                this.eventModal.close();
            },1000);   
            console.log("Cannot delete user name:", err);
        } 
    }

    async writeMessage() {
        const event = this.ctx.currentEvent;
        const link = PathJumper.generateLink();
        const txt = link + '\n\n' + event.toString();
        await navigator.clipboard.writeText(txt);
        document.querySelector("snack-bar").show("Le lien est copié!");
    }
}