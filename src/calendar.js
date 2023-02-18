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
        this.setupDates();
        this.setupControls();
        this.addSwipe();
    }

    setupControls() {  
        document.getElementById("nextWeekBtn").addEventListener("click", () => {
            this.nextWeek();
        });
        document.getElementById("prevWeekBtn").addEventListener("click", () => {
            this.prevWeek();
        });
        document.getElementById("addButton").addEventListener("click", () => {
            if(this.ctx.principal) {
                this.ctx.principal.createNewEvent()
            }
        });
        document.getElementById("todayButton").addEventListener("click", () => {
            this.showCurrentWeek()
        });
        document.getElementById("loadButton").addEventListener("click", () => {
            window.location.reload();
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
        if (touchstartX - touchendX > 80) {that.nextWeek()};
        if (touchendX -touchstartX > 80) {that.prevWeek()};
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
        const timeColumns = document.querySelectorAll(".dayTime");
        timeColumns.forEach((timeColumn) => {
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
            timeColumn.appendChild(header);
            timeColumn.appendChild(slots);
            timeColumn.querySelector(`.time[data-hour="0"]`).style.visibility = "hidden";
        })
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

        this.ctx.prevWeekStart = addDays(this.ctx.weekStart, -7);
        this.ctx.nextWeekStart = addDays(this.ctx.weekStart, 7);
        // console.log("prev-week: ", dateString(this.ctx.prevWeekStart), "main-week: ", dateString(this.ctx.weekStart),"next-week: ", dateString(this.ctx.nextWeekStart));
    }

    showCurrentWeek() {
        this.hideCurrentDay();
        this.weekOffset = 0;
        this.calculateCurrentWeek();
        this.setupDates();
        this.loadEvents();
    }

    nextWeek() {
        document.getElementById("calendar").classList.add("move-left");
        setTimeout(() => {
            document.getElementById("calendar").classList.remove("move-left");
            this.weekOffset += 1;
            this.ctx.weekStart = this.ctx.nextWeekStart;
            this.ctx.weekEnd = addDays(this.ctx.weekEnd, 7);
            this.ctx.prevWeekStart = addDays(this.ctx.weekStart, -7);
            this.ctx.nextWeekStart = addDays(this.ctx.weekStart, 7);
            this.setupDates();
            this.loadEvents();
            // console.log("prev-week: ", dateString(this.ctx.prevWeekStart), "main-week: ", dateString(this.ctx.weekStart),"next-week: ", dateString(this.ctx.nextWeekStart));
        },1000);
    }

    prevWeek() {
        document.getElementById("calendar").classList.add("move-right");
        setTimeout(() => {
            document.getElementById("calendar").classList.remove("move-right");
            this.weekOffset += -1;
            this.ctx.weekStart = this.ctx.prevWeekStart;
            this.ctx.weekEnd = addDays(this.ctx.weekEnd, -7);
            this.ctx.prevWeekStart = addDays(this.ctx.weekStart, -7);
            this.ctx.nextWeekStart = addDays(this.ctx.weekStart, 7);
            this.setupDates();
            this.loadEvents();
            // console.log("prev-week: ", dateString(this.ctx.prevWeekStart), "main-week: ", dateString(this.ctx.weekStart),"next-week: ", dateString(this.ctx.nextWeekStart));
        },1000);
    }

    setupMainWeek() {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const mainWeek = document.getElementById("main-week");
            const date = addDays(this.ctx.weekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            mainWeek.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }
    }
    setupPrevWeek() {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const prevWeek = document.getElementById("prev-week");
            const date = addDays(this.ctx.prevWeekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            prevWeek.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }
    }
    setupNextWeek() {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const nextWeek = document.getElementById("next-week");
            const date = addDays(this.ctx.nextWeekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            nextWeek.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }
    }

    setupDates() {
        document.getElementById("currentMonth").innerHTML = this.ctx.weekStart.toLocaleDateString('fr-FR', {month: "long"});
        this.setupMainWeek();
        this.setupPrevWeek();
        this.setupNextWeek();

        if (this.weekOffset == 0) {
            this.showCurrentDay();
        } else {
            this.hideCurrentDay();
        }
    }

    showCurrentDay() {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        document.getElementById("main-week").querySelector(`.day[data-dayIndex="${dayIndex}"]`).classList.add("currentDay");
    }

    hideCurrentDay() {
        const days = document.querySelectorAll(".day");
        days.forEach((day) => {
            day.classList.remove("currentDay");
        });
    }

    async createEvent(event) {
        const evt = await this.eventService.createEvent(event);
        if (evt.weekStart !== dateString(this.ctx.weekStart) && evt.weekStart !== dateString(this.ctx.prevWeekStart) && evt.weekStart !== dateString(this.ctx.nextWeekStart) ) {
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

        this.loadMainWeek();
        this.loadPrevWeek();
        this.loadNextWeek();
    }

    loadMainWeek() {
        this.events = this.eventService.loadEvents(dateString(this.ctx.weekStart))
        .then(events => {
            this.events = events;
            this.events.forEach(evt => evt.show());
        })
        .catch(err => console.log("Cannot Load Events:", err));
    };

    loadPrevWeek() {
        this.events = this.eventService.loadEvents(dateString(this.ctx.prevWeekStart))
        .then(events => {
            this.events = events;
            this.events.forEach(evt => evt.show());
        })
        .catch(err => console.log("Cannot Load Events:", err));
    };

    loadNextWeek() {
        this.events = this.eventService.loadEvents(dateString(this.ctx.nextWeekStart))
        .then(events => {
            this.events = events;
            this.events.forEach(evt => evt.show());
        })
        .catch(err => console.log("Cannot Load Events:", err));
    };    

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

