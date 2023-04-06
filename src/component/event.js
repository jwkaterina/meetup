import './event.css';
import { dateString, getDayIndex, addDays } from "../helper";
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
        let eventSlot, image, number;
        if (weekContainer.querySelector(`[id='${this.id}']`)) {
            eventSlot = weekContainer.querySelector(`[id='${this.id}']`);
            image = eventSlot.querySelector(".event-img");
            number = eventSlot.querySelector(".event-number");
        } else {
            eventSlot = document.createElement("div");
            eventSlot.className ="event";
            eventSlot.setAttribute("id", this.id);
            eventSlot.addEventListener("click", () => {
                ctx.principal.openEventModal(this)
            });            
            image = document.createElement("img");
            image.className = "event-img";
            eventSlot.appendChild(image);
            number = document.createElement("p");
            number.className = "event-number";
            eventSlot.appendChild(number);

            const day = weekContainer.querySelector(`.day-slots[data-dayIndex="${this.dayIndex}"]`);
            day.appendChild(eventSlot);
        }

        this.setImage(image);
        this.setNumber(number);
        this.setColor(eventSlot);
        this.setPosition(eventSlot);
        this.setMark(eventSlot, ctx);

        return eventSlot
    }

    setImage(image) {
        let imgSrc;
        if(this.type && this.type === "tr") {
            imgSrc = "../icons/tr-w.png";
        } else {
            this.type = "pm";
            imgSrc = "../icons/pm-w.png";
        }

        image.src = imgSrc;
    }

    setNumber(number) {
        number.innerHTML = this.memberIds.length;
    }

    setColor(eventSlot) {
        if(this.type && this.type === "tr") {
            this.color = "var(--blue)";
        } else {
            this.type = "pm";
            this.color = "var(--green)";
        }
        eventSlot.style.background = this.color;
    }

    setPosition(eventSlot) {
        const media = window.matchMedia("(max-width: 850px)");
        const h = this.slotHeight;
        if (media.matches) {
            eventSlot.style.top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            eventSlot.style.bottom = 24 * h - (this.endHour + this.endMinutes / 60) * h + 3 + "px";
        } else {
            eventSlot.style.top = (this.startHour + this.startMinutes / 60 ) * h + 1 + "px";
            eventSlot.style.bottom = 24 * h - (this.endHour + this.endMinutes / 60) * h + 5 + "px";
        }
    }

    setMark(eventSlot, ctx) {
        if(this.memberIds.includes(ctx.principal.user.id)) {
            eventSlot.classList.add("mark");
        } else {
            eventSlot.classList.remove("mark");
        }
    }
}