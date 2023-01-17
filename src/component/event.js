import './event.css';
import { dateString, getDayIndex, generateId } from "../helper";
import { Context } from "../ctx";

export default class Event {
    constructor(data) {
        this.id = data.id || generateId(data.date);
        this.place = data.place;
        this.members = data.members;
        this.start = data.start;
        this.end = data.end;
        this.date = data.date;
        this.color = data.color;
        this.slotHeight = 50;
        this.slotHeightMobile = 35;
    }

    get dayIndex() {
        return getDayIndex(new Date(this.date));
    }

    get duration() {
        return (
            (new Date(`${this.date}T${this.end}`).getTime() -
                new Date(`${this.date}T${this.start}`).getTime()) /
            (1000 * 60)
        );
    }

    get startHour() {
        return parseInt(this.start.substring(0, 2));
    }

    get startMinutes() {
        return parseInt(this.start.substring(3, 5));
    }

    get endHour() {
        return parseInt(this.end.substring(0, 2));
    }

    get endMinutes() {
        return parseInt(this.end.substring(3, 5));
    }

    show() {
        const ctx = Context.getInstance();
        const media = window.matchMedia("(max-width: 800px)");

        if (
            this.date < dateString(ctx.weekStart) ||
            this.date > dateString(ctx.weekEnd)
        ) {
            document.getElementById(`${this.id}`).remove();
            return;
        }

        let eventSlot;
        let numberCircle;
        if (document.getElementById(`${this.id}`)) {
            eventSlot = document.getElementById(`${this.id}`);
            numberCircle = eventSlot.querySelector(".circle");
        } else {
            eventSlot = document.createElement("div");
            eventSlot.className ="event";
            eventSlot.setAttribute("id", this.id);
            eventSlot.addEventListener("click", () => {
                ctx.principal.openEventModal(this)
            });

            numberCircle = document.createElement("div");
            numberCircle.className = "circle";
            numberCircle.style.display = "none";
            eventSlot.appendChild(numberCircle);
            
        }

        const ids = this.members.map((member) => member.id);        

        if (media.matches) {
            const h = this.slotHeightMobile;
            eventSlot.style.top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            eventSlot.style.bottom = 24 * h - (this.endHour + this.endMinutes / 60) * h + 3 + "px";

            if(this.members.length > 0) {
                numberCircle.style.display = "inline-block";
                numberCircle.innerHTML = this.members.length;
            }
        } else {
            const h = this.slotHeight;
            eventSlot.style.top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            eventSlot.style.bottom = 24 * h - (this.endHour + this.endMinutes / 60) * h + 5 + "px";

            const main = this.members[0];    
            let lis = "";
            lis = `<li class="member">${main.name}</li>`;
            if(ids.includes(ctx.principal.common.user.id) && ctx.principal.common.user.id != main.id) {
                lis += `<li class="member">${ctx.principal.common.user.name}</li>`;
            }
            this.members.forEach((member) => {
                if(member.id != main.id && member.id != ctx.principal.common.user.id) {
                    lis += `<li class="member">${member.name}</li>`;
                }
            });
            let txt = "";
            txt = `<a class="place" target="_blank">
            <i class="fa-sharp fa-solid fa-location-dot"></i>
            ${this.place}</a>
                <ul class="list">${lis}</ul>`
            eventSlot.innerHTML = txt;
        }

        if(ids.includes(ctx.principal.common.user.id)) {
            this.color = "var(--blue)";
        } else {
            this.color = "var(--green)";
        } 
        eventSlot.style.background = this.color;

        const day = document.querySelector(`.day[data-dayIndex="${this.dayIndex}"]`);
        const slots = day.querySelector(".slots");
        slots.appendChild(eventSlot);
    }
}