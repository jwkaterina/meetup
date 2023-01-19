import Event from "../component/event";
import { dateString, addDays, getDayIndex } from "../helper";

export default class EventService {
    loadEvents(weekStart) {
        return this.loadFromLocalStorage(weekStart);
    }

    saveEvent(event) {
        this.saveToLocalStorage(event);
    }

    deleteEvent(event) {
        this.deleteFromLocalStorage(event);
    }

    loadFromLocalStorage(weekStart) {
        const allEvents = this.loadEventsFromLocalStorage();
        const key = dateString(weekStart);
        const weekEvents = allEvents[key];
        if (!weekEvents) {
            return [];
        }

        const events = [];

        for (const evt of weekEvents) {
            const event = new Event(evt);
            events.push(event);
        }

        return events;
    }

    saveToLocalStorage(event) {
        const allEvents = this.loadEventsFromLocalStorage();
        const timestamp = Date.parse(event.date);
        const date = new Date(timestamp);
        const weekStarts = dateString(addDays(date, -getDayIndex(date)));

        let weekEvents = allEvents[weekStarts];

        if (!weekEvents) {
            weekEvents = [];
        }

        const index = weekEvents.findIndex(evt => evt.id == event.id);
        if (index > -1) {
            weekEvents.splice(index, 1);
        }
        weekEvents.push(event);

        allEvents[weekStarts] = weekEvents;

        this.saveEventsToLocalStorage(allEvents);
    }

    deleteFromLocalStorage(event) {
        const allEvents = this.loadEventsFromLocalStorage();
        const timestamp = Date.parse(event.date);
        const date = new Date(timestamp);
        const weekStarts = dateString(addDays(date, -getDayIndex(date)));

        let weekEvents = allEvents[weekStarts];

        if (!weekEvents) {
            weekEvents = [];
        }

        const index = weekEvents.findIndex(evt => evt.id == event.id);
        if (index > -1) {
            weekEvents.splice(index, 1);
        }

        this.saveEventsToLocalStorage(allEvents);
    }

    loadEventsFromLocalStorage() {
        const allEvents = JSON.parse(localStorage.getItem("events"));
        if (!allEvents) {
            return {};
        }

        return allEvents;
    }

    saveEventsToLocalStorage(events) {
        localStorage.setItem("events", JSON.stringify(events));
    }
}