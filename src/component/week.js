import EventCalendar from "../event-calendar";
import { addDays } from "../helper";

export default class Week {
    constructor(weekStart, className) {

        this.weekStart = weekStart;
        this.container = document.createElement("div");
        this.container.className = className;
        this.container.innerText = weekStart;
        this.setupDates();
        this.show();

        this.eventCalendar = new EventCalendar();
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

    remove() {
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

    loadEvents() {
        this.eventCalendar.loadEvents(this.container, this.weekStart);
    }
}