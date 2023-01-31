import { getDayIndex, addDays, dateString } from "./helper";
import { Context } from "./ctx";
import EventService from "./service/event";
import ValidationError from "./error/validation-error";
import "./calendar.css";

export default class Calendar {
    constructor() {
        this.events = [];
        this.eventService = new EventService();
        this.weekOffset = 0;
        this.ctx = Context.getInstance();
    }

    setup() {
        this.setupTimes();
        this.calculateCurrentWeek();
        this.setupDays();
        this.showWeek();
        this.setupControls();
        this.addSwipe();
    }

    setupControls() {  
        document.getElementById("nextWeekBtn").addEventListener("click", () => {
            this.changeWeek(1)
        });
        document.getElementById("prevWeekBtn").addEventListener("click", () => {
            this.changeWeek(-1)
        });
        document.getElementById("addButton").addEventListener("click", () => {
            if(this.ctx.principal) {
                this.ctx.principal.createNewEvent()
            }
        });
        document.getElementById("todayButton").addEventListener("click", () => {
            this.showCurrentWeek()
        });
        window.addEventListener("load", () => {
            scrollTo(0, 375);
        });
        let lastWidth = window.innerWidth;
        window.addEventListener("resize", () => {
            if(window.innerWidth!=lastWidth) {
                window.location.reload();
                lastWidth = window.innerWidth;
            }
        });
    }

    addSwipe() {
        let touchstartX = 0;
        let touchendX = 0;
        let that = this;

        function checkDirection() {
        if (touchstartX - touchendX > 80) {that.changeWeek(1)};
        if (touchendX -touchstartX > 80) {that.changeWeek(-1)};
        }

        document.getElementById("calendar").addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        });

        document.getElementById("calendar").addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        checkDirection()
        });
    }

    setupTimes() {
        const header = document.createElement("div");
        header.className = "columnHeader";
        const slots = document.createElement("div");
        slots.className = "slots";
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement("div");
            timeSlot.setAttribute("data-hour", hour);
            timeSlot.className = "time";
            timeSlot.innerHTML = `${hour}:00`;
            slots.appendChild(timeSlot);
        }
        document.querySelector(".dayTime").appendChild(header);
        document.querySelector(".dayTime").appendChild(slots);
        document.querySelector(`.time[data-hour="0"]`).style.visibility = "hidden";
    }


    setupDays() {
        const media = window.matchMedia("(max-width: 800px)");
        const cal = this;

            const days = document.querySelectorAll(".day");
            days.forEach((day) => {
            const shortName = day.getAttribute("data-shortName");
            const fullName = day.getAttribute("data-name");
            const header = document.createElement("div");
            header.className = "columnHeader";
            if (media.matches) {
                header.innerHTML = `${shortName}`;
            } else {
                header.innerHTML = `${fullName}`;
            }
            const dayDisplay = document.createElement("div")
            dayDisplay.className = "dayDisplay";
            header.appendChild(dayDisplay);
            day.appendChild(header);

            const dayIndex = parseInt(day.getAttribute("data-dayIndex"));
            const slots = document.createElement("div");
            slots.className = "slots";
            for (let hour = 0; hour < 24; hour++) {
                const slot = document.createElement("div");
                slot.setAttribute("data-hour", hour);
                slot.className = "slot";
                slots.appendChild(slot);
                slot.addEventListener("click", () => {
                    if(cal.ctx.principal) {
                        cal.ctx.principal.clickSlot(hour, dayIndex);
                    }
                })
            }
            day.appendChild(slots);
        });
    }

    calculateCurrentWeek() {
        const now = new Date();
        this.ctx.weekStart = addDays(now, -getDayIndex(now));
        this.ctx.weekEnd = addDays(this.ctx.weekStart, 6);
    }

    changeWeek(number) {
        this.weekOffset += number;
        this.ctx.weekStart = addDays(this.ctx.weekStart, 7 * number);
        this.ctx.weekEnd = addDays(this.ctx.weekEnd, 7 * number);
        this.showWeek();
        this.loadEvents();
    }

    showWeek() {
         document.getElementById("currentMonth").innerHTML = this.ctx.weekStart.toLocaleDateString('fr-FR', {month: "long"});

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.ctx.weekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            document.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }
        if (this.weekOffset == 0) {
            this.showCurrentDay();
        } else {
            this.hideCurrentDay();
        }
    }

    showCurrentWeek() {
        this.hideCurrentDay();
        this.weekOffset = 0;
        this.calculateCurrentWeek();
        this.showWeek();
        this.loadEvents();

    }

    showCurrentDay() {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        document.querySelector(`.day[data-dayIndex="${dayIndex}"]`).classList.add("currentDay");
    }

    hideCurrentDay() {
        const days = document.querySelectorAll(".day");
        days.forEach((day) => {
            day.classList.remove("currentDay");
        });
    }

    async createEvent(event) {
        const evt = await this.eventService.createEvent(event);
        if (evt.weekStart !== dateString(this.ctx.weekStart)) {
            return;
        }
        this.events.push(evt);
        evt.show();
    }

    async updateEvent(event) {
        const evt = await this.eventService.updateEvent(event);
        this._removeEventLocally(evt.id);
        this.events.push(evt);
        event.show();
    }

    loadEvents() {
        const events = document.querySelectorAll(".event");
        events.forEach((event) => {
            event.remove();
        });

        this.events = this.eventService.loadEvents(dateString(this.ctx.weekStart))
        .then(events => {
            this.events = events;
            this.events.forEach(evt => evt.show());
        })
        .catch(err => console.log("Cannot Load Events:", err));
    }

    async deleteEvent(id) {
        const removedEvent = this._removeEventLocally(id);
        if (removedEvent) {
            return await this.eventService.deleteEvent(removedEvent);
        } else {
            return Promise.reject(`No event with id ${id}`);
        }
    }

    _removeEventLocally(id) {
        const index = this.events.findIndex(evt => evt.id == id);
        if (index > -1) {
            const removedEvents = this.events.splice(index, 1);
            return removedEvents[0];
        }
        return null;
    }

    checkEvent(event, newStart, newEnd, newDate) {
        const collision = this.events
        .filter(evt => evt.date == newDate)
        .find(evt => evt.id != event.id && evt.end > newStart && evt.start < newEnd);

        if(collision) {
            throw new ValidationError(`Cela se heurte au groupe (${collision.start} - ${collision.end}).`);
        }

        const duration =
            (new Date(`${newDate}T${newEnd}`).getTime() -
                new Date(`${newDate}T${newStart}`).getTime()) /
            (1000 * 60);
        if (duration < 0) {
            throw new ValidationError("Le début ne peut pas être après la fin.");
        }
    }
}

