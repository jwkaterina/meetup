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
        this.headings = this._createHeadings(className, weekStart);
        this.slots = this._createSlots(className, weekStart);
        this.loadingAnime = document.getElementById("loading-form");

        this.events = [];
        this.eventService = new EventService();
    }

    insertAfter(week) {
        this.headings.after(week.headings);
        this.slots.after(week.slots);
    }

    insertBefore(week) {
        this.headings.before(week.headings);
        this.slots.before(week.slots);
    }

    appendToParent(headingsParent, slotsParent) {
        headingsParent.appendChild(this.headings);
        slotsParent.appendChild(this.slots);
    }

    removeFromDom() {
        this.headings.remove();
        this.slots.remove();
    }

    set className(className) {
        this.headings.className = `${className}-headings`;
        this.slots.className = `${className}-slots`;
    }

    _createHeadings(className, weekStart) {
        const headings = document.createElement("div");
        headings.className = `${className}-headings`;
        headings.dataset.weekStart = dateString(weekStart);

        headings.innerHTML = `
        <div data-name="Lundi" data-shortName="L" data-dayIndex = "0" class="day-heading">           
        </div>
        <div data-name="Mardi" data-shortName="M" data-dayIndex = "1" class="day-heading">           
        </div>
        <div data-name="Mercredi" data-shortName="M" data-dayIndex = "2" class="day-heading">           
        </div>
        <div data-name="Jeudi" data-shortName="J" data-dayIndex = "3" class="day-heading">            
        </div>
        <div data-name="Vendredi" data-shortName="V" data-dayIndex = "4" class="day-heading">           
        </div>
        <div data-name="Samedi" data-shortName="S" data-dayIndex = "5" class="day-heading">            
        </div>
        <div data-name="Dimanche" data-shortName="D" data-dayIndex = "6" class="day-heading">           
        </div>
        `;

        this._setupDays(headings);
        this._setupDates(headings);

        return headings;
    }

    _setupDays(headings) {
        const media = window.matchMedia("(max-width: 720px)");
        const days = headings.querySelectorAll(".day-heading");
        days.forEach((day) => {
            const shortName = day.getAttribute("data-shortName");
            const fullName = day.getAttribute("data-name");
            if (media.matches) {
                day.innerHTML = `${shortName}`;
            } else {
                day.innerHTML = `${fullName}`;
            }
            const dateDisplay = document.createElement("div")
            dateDisplay.className = "date-display";
            day.appendChild(dateDisplay);
        });
    }

    _setupDates(headings) {
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const date = addDays(this.weekStart, dayIndex);
            const display = date.toLocaleDateString('fr-FR', {day: "numeric"});
            headings.querySelector(`.day-heading[data-dayIndex="${dayIndex}"] .date-display`).innerHTML = display;
        }

        if (this.weekOffset == 0) {
            this._showCurrentDay(headings);
        } else {
            this._hideCurrentDay(headings);
        }
    }

    _showCurrentDay(headings) {
        const now = new Date();
        const dayIndex = getDayIndex(now);
        headings.querySelector(`.day-heading[data-dayIndex="${dayIndex}"]`).classList.add("currentDay");
    }

    _hideCurrentDay(headings) {
        const days = headings.querySelectorAll(".day-heading");
        days.forEach((day) => {
            day.classList.remove("currentDay");
        });
    }

    _createSlots(className, weekStart) {
        const slots = document.createElement("div");
        slots.className = `${className}-slots`;
        slots.dataset.weekStart = dateString(weekStart);

        slots.innerHTML = `
        <div data-dayIndex = "0" class="day-slots">           
        </div>
        <div data-dayIndex = "1" class="day-slots">           
        </div>
        <div data-dayIndex = "2" class="day-slots">           
        </div>
        <div data-dayIndex = "3" class="day-slots">            
        </div>
        <div data-dayIndex = "4" class="day-slots">           
        </div>
        <div data-dayIndex = "5" class="day-slots">            
        </div>
        <div data-dayIndex = "6" class="day-slots">           
        </div>
        `;

        const days = slots.querySelectorAll(".day-slots");
        days.forEach((day) => {
            const dayIndex = parseInt(day.getAttribute("data-dayIndex"));
            for (let hour = 0; hour < 24; hour++) {
                const slot = document.createElement("div");
                slot.setAttribute("data-hour", hour);
                slot.className = "slot";
                day.appendChild(slot);
                slot.addEventListener("click", () => {
                    if(this.ctx.principal) {
                        this.ctx.principal.clickSlot(hour, dayIndex);
                    }
                })
            }
        });
       
        return slots;
    }

    pushEvent(event) {
        if (event.weekStart !== dateString(this.weekStart) ) {
            return;
        }
        this.events.push(event);
        event.show();
    }

    loadEvents(showLoadingAnimation = false) {
        const events = this.slots.querySelectorAll(".event");
        events.forEach((event) => {
            event.remove();
        });

        this._loadWeek(showLoadingAnimation);
    }

    _loadWeek(showLoadingAnimation) {
        if (showLoadingAnimation) {
            this.loadingAnime.style.display = "block";
        }
        this.events = this.eventService.loadEvents(dateString(this.weekStart))
        .then(events => {
            if (showLoadingAnimation) {
                this.loadingAnime.style.display = "none";
            }
            this.events = events;
            this.events.forEach(evt => evt.show());
            // console.log(`Got events for weekStart: ${this.weekStart}`, events);
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

        const duration =
            (new Date(`${newDate}T${newEnd}`).getTime() -
                new Date(`${newDate}T${newStart}`).getTime()) /
            (1000 * 60);
        if (duration <= 0 || duration === 0) {
            throw new ValidationError('La durée doit être plus que "0"');
        }
        }
    }   
}