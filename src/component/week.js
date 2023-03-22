import { addDays, dateString, getDayIndex } from "../helper";
import ValidationError from "../error/validation-error";
import EventService from "../service/event";
import { Context } from "../ctx";
import "./week.css";


export default class Week {
    constructor(weekStart, weekOffset, className) {

        this.ctx = Context.getInstance();
        this.weekStart = weekStart;
        this.weekOffset = weekOffset;
        this.container = this._createDomElements(className, weekStart);
        // this.show();

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

    hide() {
        this.container.style.display = "";
    }

    set className(className) {
        this.container.className = className;
    }

    _createDomElements(className, weekStart) {
        const container = document.createElement("div");
        container.className = className;
        container.dataset.weekStart = dateString(weekStart);

        container.innerHTML = `
        <div data-name="Lundi" data-shortName="L" data-dayIndex = "0" class="day">           
        </div>
        <div data-name="Mardi" data-shortName="M" data-dayIndex = "1" class="day">           
        </div>
        <div data-name="Mercredi" data-shortName="M" data-dayIndex = "2" class="day">           
        </div>
        <div data-name="Jeudi" data-shortName="J" data-dayIndex = "3" class="day">            
        </div>
        <div data-name="Vendredi" data-shortName="V" data-dayIndex = "4" class="day">           
        </div>
        <div data-name="Samedi" data-shortName="S" data-dayIndex = "5" class="day">            
        </div>
        <div data-name="Dimanche" data-shortName="D" data-dayIndex = "6" class="day">           
        </div>
        `;

        this._setupDays(container);
        this._setupDates(container);

        return container;
    }


    _setupDays(container) {
        const media = window.matchMedia("(max-width: 800px)");
        const week = this;

        const days = container.querySelectorAll(".day");
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
                    if(week.ctx.principal) {
                        week.ctx.principal.clickSlot(hour, dayIndex);
                    }
                })
            }
            day.appendChild(slots);
        });
    }

    _setupDates(container) {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.weekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            container.querySelector(`.day[data-dayIndex="${dayIndex}"] .dayDisplay`).innerHTML = display;
        }

        if (this.weekOffset == 0) {
            this._showCurrentDay(container);
        } else {
            this._hideCurrentDay(container);
        }
    }

    _showCurrentDay(container) {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        container.querySelector(`.day[data-dayIndex="${dayIndex}"]`).classList.add("currentDay");
    }

    _hideCurrentDay(container) {
        const days = container.querySelectorAll(".day");
        days.forEach((day) => {
            day.classList.remove("currentDay");
        });
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