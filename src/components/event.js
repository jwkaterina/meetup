import './event.css';
import { dateString, getDayIndex, generateId } from "../helper";
// import { PrincipalCommon } from "../principal";
// import { Settings } from "../settings";
import { Context } from "../ctx";

export default class Event {
    constructor(data) {
        this.id = data.id || generateId();
        this.place = data.place;
        this.names = data.names;
        this.start = data.start;
        this.end = data.end;
        this.date = data.date;
        this.prevDate = this.date;
        this.color = data.color;
        this.slotHeight = 50;
        this.slotHeightMobile = 35;
        // this.settings = Settings.getInstance();
        // this.common = new PrincipalCommon();
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
        if (document.getElementById(`${this.id}`)) {
            eventSlot = document.getElementById(`${this.id}`);
        } else {
            eventSlot = document.createElement("div");
            eventSlot.className ="event";
            eventSlot.setAttribute("id", this.id);
            eventSlot.addEventListener("click", () => {
                ctx.principal.openEventModal(this)
            });
        }

        let lis = "";
        this.names.forEach((value, index) => {
            lis += `<li class="member" member=${index + 1}>${value}</li>`
        });
        let txt = "";
        txt = `<a class="place" target="_blank">${this.place}</a>
            <ol class="list">${lis}</ol>`
        eventSlot.innerHTML = txt;
        if (media.matches) {
            if(this.names.length == 0) {
                return
            } else {
                const circle = document.createElement("div");
                circle.className = "circle";
                circle.innerHTML = this.names.length;
                eventSlot.innerHTML = "";
                eventSlot.appendChild(circle);
            }
        }

        let h;
        if (media.matches) {
            h = this.slotHeightMobile;
            eventSlot.style.top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            eventSlot.style.bottom = (24 - this.endHour + this.endMinutes / 60) * h + 3 + "px";
            // console.log(h);
        } else {
            h = this.slotHeight;
            eventSlot.style.top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            eventSlot.style.bottom = (24 - this.endHour + this.endMinutes / 60) * h + 5 + "px";
            // console.log(h);
        }
        // const h = document.querySelector(".slot").offsetWidth
        // eventSlot.style.top = (this.startHour + this.startMinutes / 60 - this.settings.dayStarts) * h -+ 1 + "px";
        // eventSlot.style.bottom = (this.settings.dayEnds - this.endHour + this.endMinutes / 60) * h + 5 + "px";
    

        if(this.names.includes(ctx.principal.userName)) {
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