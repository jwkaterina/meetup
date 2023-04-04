import { dateString } from "./helper";
import { Context } from "./ctx";
import EventService from "./service/event";
import ValidationError from "./error/validation-error";

export default class EventCalendar {
    constructor() {
        this.events = [];
        this.eventService = new EventService();
        this.ctx = Context.getInstance();
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

    loadEvents(weekContainer, weekStart) {
        const events = weekContainer.querySelectorAll(".event");
        events.forEach((event) => {
            event.remove();
        });

        this._loadWeek(weekStart);
    }

    _loadWeek(weekStart) {
        this.events = this.eventService.loadEvents(dateString(weekStart))
        .then(events => {
            this.events = events;
            this.events.forEach(evt => evt.show());
            console.log(`Got events for weekStart: ${weekStart}`, events);
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

