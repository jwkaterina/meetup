// import './event.css';
import './custom-event.js'
import { getDayIndex } from "../helper";
import { Context } from "../ctx";

export default class Event {
    constructor(data) {
        this.id = data.id;
        this.weekStart = data.weekStart;
        this.place = data.place;
        this.memberIds = data.memberIds;
        this.start = data.start;
        this.end = data.end;
        this.date = data.date;
        this.color = data.color;
        this.type = data.type;
        this.slotHeight = document.querySelector(".slot").offsetHeight;
        this.slotWidth = document.querySelector(".slot").offsetWidth;
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
        const weekContainer = this.findWeekContainer();
        const ctx = Context.getInstance();

        if (!weekContainer) {
            return;
        }

        this.createEventElement(weekContainer, ctx);
    }

    findWeekContainer() {
        const weeksContainer = document.getElementById("week-slots");
        for (const child of weeksContainer.children) {
            if(child.dataset.weekStart && child.dataset.weekStart === this.weekStart) {
                return child;
            }
        }
        return null;
    }

    createEventElement(weekContainer, ctx) {
        let eventSlot;
        if (weekContainer.querySelector(`[id='${this.id}']`)) {
            eventSlot = weekContainer.querySelector(`[id='${this.id}']`);
        } else {
            eventSlot = document.createElement("event-slot");
            eventSlot.setAttribute("id", this.id);
            eventSlot.addEventListener("click", () => {
                ctx.principal.openEventModal(this)
            });            

            const day = weekContainer.querySelector(`.day-slots[data-dayIndex="${this.dayIndex}"]`);
            day.appendChild(eventSlot);
        }

        this.setNumber(eventSlot);
        this.setImage(eventSlot);
        this.setColor(eventSlot);
        this.setPosition(eventSlot);
        this.setMark(eventSlot, ctx);

        return eventSlot
    }

    setImage(eventSlot) {
        let imgSrc;
        if(this.type && this.type === "tr") {
            imgSrc = "../icons/tr-w.png";
        } else {
            this.type = "pm";
            imgSrc = "../icons/pm-w.png";
        }

        eventSlot.setAttribute("imgsrc", imgSrc);
        eventSlot.setImage();
    }

    setNumber(eventSlot) {
        const number = this.memberIds.length;
        eventSlot.setAttribute("number", number);
        eventSlot.setNumber();
    }

    setColor(eventSlot) {
        if(this.type && this.type === "tr") {
            this.color = "var(--blue)";
        } else {
            this.type = "pm";
            this.color = "var(--green)";
        }
        eventSlot.setAttribute("color", this.color);
        eventSlot.setColor();    
    }

    setPosition(eventSlot) {
        const media = window.matchMedia("(max-width: 720px)");
        const h = this.slotHeight;
        const w = this.slotWidth;

        let top, bottom, width;
        if (media.matches) {
            top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            bottom = 24 * h - (this.endHour + this.endMinutes / 60) * h + 3 + "px";
            width = (w - 3) + "px";
        } else {
            top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            bottom = 24 * h - (this.endHour + this.endMinutes / 60) * h + 5 + "px";
            width = (w - 5) + "px";
        }
        eventSlot.setAttribute("top", top);
        eventSlot.setAttribute("bottom", bottom);
        eventSlot.setAttribute("width", width);
        eventSlot.setPosition();  
    }

    setMark(eventSlot, ctx) {
        if(this.memberIds.includes(ctx.principal.user.id)) {
            eventSlot.addMark();
        } else {
            eventSlot.removeMark();
        }
    }
}