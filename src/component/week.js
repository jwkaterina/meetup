import { addDays, dateString } from "../helper";
import ValidationError from "../error/validation-error";

export default class Week {
    constructor(weekStart, className) {

        this.weekStart = weekStart;
        this.container = document.createElement("div");
        this.container.className = className;
        this.container.innerText = weekStart;
        this.setupDates();
        this.show();

        this.events = [];
        this.eventService = new EventService();
    }

    insertAfter(week) {
        this.container.after(week.container);
    }

    insertBefore(week) {
        this.container.before(week.container);
    }

    appendToParent(parent) {
        parent.appendChild(this.container);
    }

    removeFromDom() {
        this.container.remove();
    }

    show() {
        this.container.style.display = "flex";
    }

    set className(className) {
        this.container.className = className;
    }

    setupDates() {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.weekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            // this.container.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }
    }

    pushEvent(event) {
        if (event.weekStart !== dateString(this.weekStart) ) {
            return;
        }
        this.events.push(event);
        event.show();
    }

    loadEvents() {
        const events = this.container.querySelectorAll(".event");
        events.forEach((event) => {
            event.remove();
        });

        this._loadWeek();
    }

    _loadWeek() {
        this.events = this.eventService.loadEvents(dateString(this.weekStart))
        .then(events => {
            this.events = events;
            this.events.forEach(evt => evt.show());
            console.log(`Got events for weekStart: ${this.weekStart}`, events);
        })
        .catch(err => console.log("Cannot Load Events:", err));
    };

    deleteEvent(id) {
        const index = this.events.findIndex(evt => evt.id == id);
        if (index > -1) {
            const removedEvents = this.events.splice(index, 1);
            return removedEvents[0];
        }
        return null;
    }

    checkEvent(event, newStart, newEnd, newDate) {
        if(event.weekStart !== dateString(this.weekStart)) {
            return;
        }
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