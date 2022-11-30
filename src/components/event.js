import './event.css';
import { dateString, getDayIndex, generateId, nameFound } from "../helper";
// import { PrincipalCommon } from "../principal";
import { Settings } from "../settings";
import { Context } from "../ctx";

export class Event {
    constructor(data) {
        this.id = data.id || generateId();
        this.place = data.place;
        this.names = data.names;
        this.start = data.start;
        this.end = data.end;
        this.date = data.date;
        this.prevDate = this.date;
        this.color = data.color;
        this.settings = Settings.getInstance();
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
            const that = this;
            eventSlot.addEventListener("click", function() {
                ctx.principal.openEventModal(that)
            });
        }
        const h = this.settings.slotHeight;

        if(!nameFound(this, ctx.userName)) {
            this.color = "var(--green)";
        } else {
            this.color = "var(--blue)";
        } 

        let lis = "";
        this.names.forEach(addToList);
        function addToList(value, index) {
            lis += `<li class="member" member=${index + 1}>${value}</li>`
        };

        let txt = "";
        txt = `<a class="place" target="_blank">${this.place}</a>
            <ol class="list">${lis}</ol>`

        eventSlot.innerHTML = txt;
        eventSlot.style.top = (this.startHour + this.startMinutes / 60 - this.settings.dayStarts) * h -+ 1 + "px";
        eventSlot.style.bottom = (this.settings.dayEnds - this.endHour + this.endMinutes / 60) * h + 5 + "px";
        eventSlot.style.background = this.color;
        const day = document.querySelector(`.day[data-dayIndex="${this.dayIndex}"]`);
        const slots = day.querySelector(".slots");
        slots.appendChild(eventSlot);

        // const duration = event.duration;
        // if (duration < 45) {
        //     eventSlot.removeClass("shortEvent").addClass("veryShortEvent");
        // } else if (duration < 59) {
        //     eventSlot.removeClass("veryShortEvent").addClass("shortEvent");
        // } else {
        //     eventSlot.removeClass("shortEvent").removeClass("veryShortEvent");
        // }

        const media = window.matchMedia("(max-width: 800px)");
        if (media.matches) {
            if(this.names.length == 0) {
                return
            } else {
                eventSlot.innerHTML = this.names.length;
            }
        }
    }
}