import { API, Auth } from "aws-amplify";
import ApiError from "../error/api-error";
import Event from "../component/event";
import { dateString, addDays, getDayIndex, weekStartOf, generateId } from "../helper";

const LOAD_FROM_BACKEND = true;

export default class EventService {
    async loadEvents(weekStart) {
        if (LOAD_FROM_BACKEND) {
            return await this._loadFromBackend(weekStart);
        }

        return await this._loadFromLocalStorage(weekStart);
    }

    async createEvent(event) {
        if (LOAD_FROM_BACKEND) {

            return await this._createOnBackend(event);
        }

        return await this._createOnLocalStorage(event);
    }

    async updateEvent(event) {
        if (LOAD_FROM_BACKEND) {
            return await this._updateOnBackend(event);
        }

        return await this._updateOnLocalStorage(event);
    }

    async deleteEvent(event) {
        if (LOAD_FROM_BACKEND) {
            return await this._deleteFromBackend(event);
        }

        return await this._deleteFromLocalStorage(event);
    }

    //======= BACKEND ==========

    async _loadFromBackend(weekStart) {
        const myInit = {
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
            }
        };

        const res = await API.get('meetup', `/events/${weekStart}`, myInit);

        if(!res.success) {
            throw new ApiError(`Could not load Events: ${res.error}`);
        }

        return res.data.map(item => new Event(item));
    }

    async _createOnBackend(event) {
        const myInit = {
            headers: {
              'Content-Type' : 'application/json',
              Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
            },
            body: event
        };

        const res = await API.post('meetup', '/events', myInit);

        if(!res.success) {
            throw new ApiError(`Could not create Event: ${res.error}`);
        }

        return new Event(res.data);
    }

    async _updateOnBackend(event) {
        const myInit = {
            headers: {
              'Content-Type' : 'application/json',
              Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
            },
            body: event
        };

        const res = await API.put('meetup', '/events', myInit);

        if(!res.success) {
            throw new ApiError(`Could not update Event: ${res.error}`);
        }

        return new Event(res.data);
    }

    async _deleteFromBackend(event) {
        const myInit = {
            headers: {
              Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
            }
        };

        const res = await API.del('meetup', `/events/object/${event.weekStart}/${event.id}`, myInit);
      
        return res;
    }

    //======= LOCAL STORAGE ==========

    _loadFromLocalStorage(weekStart) {
        const allEvents = this._loadEventsFromLocalStorage();
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

        return Promise.resolve(events);
    }

    _createOnLocalStorage(event) {
        if(event.id) {
            return Promise.reject('Event.Id must not be set on Create');
        }

        if(!event.weekStart) {
            return Promise.reject('Event.weekStart not defined');
        }

        if(!event.date) {
            return Promise.reject('date not defined');
        }

        if(!event.start) {
            return Promise.reject('start not defined');
        }

        const id = generateId(event.date);
        const weekStart = weekStartOf(event.date).toISODate();

        event.id = id;
        event.weekStart = weekStart;

        this._saveToLocalStorage(event);

        return Promise.resolve(event);
    }

    _updateOnLocalStorage(event) {
        const {id, weekStart, ...rest} = event;

        if(!id) {
            return Promise.reject('id not defined');
        }

        if(!weekStart) {
            return Promise.reject('weekStart not defined');
        }

        const existingEvents = this._loadEventsFromLocalStorage(weekStart);
        if (!existingEvents[weekStart]) {
            return Promise.reject('No current Event in Database!');
        }
        const existingEvent = existingEvents[weekStart].find(evt => evt.id == id);

        if (!existingEvent) {
            return Promise.reject(`Cannont Update Event with id ${event.id}. No such Event in database.`);
        }

        if (existingEvent.date !== rest.date) {
            return Promise.reject("Date change is forbidden!");
        }

        const updatedEvent = new Event({
            id: existingEvent.id,
            weekStart: existingEvent.weekStart,
            ...rest,
        });

        this._saveToLocalStorage(updatedEvent);

        return Promise.resolve(updatedEvent);
    }

    _deleteFromLocalStorage(event) {
        const allEvents = this._loadEventsFromLocalStorage();
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

        this._saveEventsToLocalStorage(allEvents);

        return Promise.resolve({success: true});
    }

    _saveToLocalStorage(event) {
        const allEvents = this._loadEventsFromLocalStorage();

        let weekEvents = allEvents[event.weekStart];

        if (!weekEvents) {
            weekEvents = [];
        }

        const index = weekEvents.findIndex(evt => evt.id == event.id);
        if (index > -1) {
            weekEvents.splice(index, 1);
        }
        weekEvents.push(event);

        allEvents[event.weekStart] = weekEvents;

        this._saveEventsToLocalStorage(allEvents);
    }

    _loadEventsFromLocalStorage() {
        const allEvents = JSON.parse(localStorage.getItem("events"));
        if (!allEvents) {
            return {};
        }

        return allEvents;
    }

    _saveEventsToLocalStorage(events) {
        localStorage.setItem("events", JSON.stringify(events));
    }
}