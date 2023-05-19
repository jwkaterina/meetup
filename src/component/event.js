import './event-slot.js'
import { getDayIndex } from "../helper";
import { Context } from "../ctx";
import { DateTime } from 'luxon';

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
        this.comment = data.comment;
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

    get dayOfWeek() {
        const date = DateTime.fromISO(this.date);
        return date.setLocale('fr-FR').weekdayLong;
    }

    get dayOfMonth() {
        const date = DateTime.fromISO(this.date);
        return date.setLocale('fr-FR').day;
    }

    toString() {
        let result = `RDV ${this.dayOfWeek} ${this.dayOfMonth} à ${this.startHour}h`;
        if (this.startMinutes !== '0' && this.startMinutes !== '00') {
            result += `:${this.startMinutes}`
        }

        result += '\n';

        if(this.place && this.place.charAt(0) !== '?') {
            result += `Lieu: ${this.place}` + '\n';
        }
        return result;
    }

    show() {
        const weekContainer = this.findWeekContainer();

        if (!weekContainer) {
            return;
        }

        this.createEventElement(weekContainer);
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

    createEventElement(weekContainer) {
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

        const ctx = Context.getInstance();
        const media = window.matchMedia("(max-width: 720px)");

        this.setNumber(eventSlot);
        this.setImage(eventSlot);
        this.setColor(eventSlot, ctx);
        this.setPosition(eventSlot, media);
        this.setMark(eventSlot, ctx);
        if(!media.matches) {
            this.setText(eventSlot, ctx);
        }

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

    setText(eventSlot, ctx) {
        let mainName = "???"
        const mainId = this.memberIds[0];         
        if(ctx.users[mainId] && ctx.users[mainId].name !== "UNDEFINED UNDEFINED") {
            mainName = ctx.users[mainId].name;
        } else {
            mainName = "";
        }

        eventSlot.setAttribute("text", mainName)
        eventSlot.setText();
    }

    setColor(eventSlot, ctx) {
        let isCurrent;
        if(ctx.currentEvent && (!ctx.currentEvent.id || ctx.currentEvent.id === this.id) || ctx.parsedEventId === this.id) {
            isCurrent = true;
        } else {
            isCurrent = false;
        }

        if(this.type && this.type === "tr") {
            this.color = "var(--blue)";
        } else {
            this.type = "pm";
            this.color = "var(--green)";
        }
       
        eventSlot.setAttribute("color", this.color);
        eventSlot.setColor(isCurrent);    
    }

    setPosition(eventSlot, media) {
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