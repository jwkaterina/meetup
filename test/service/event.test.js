import EventService from "../../src/service/event";
import events from "../utils/events_in_local_storage.json";
import { dateString, generateId, weekStartOf } from "../../src/helper";
import Event from "../../src/component/event";


class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }
}

describe('EventService', () => {

    document.querySelector = jest.fn(() => {
      return {
          offsetHeight: 50
      }
    });

    global.localStorage = new LocalStorageMock;
    global.localStorage.setItem('events', JSON.stringify(events));

    it("should load events from localstorage", async () => {
        //init
        const date = new Date(2023, 0, 9);
        const eventsService = new EventService();

        //invoke
        const res = await eventsService._loadFromLocalStorage(dateString(date));

        //check
        expect(res.length).toBe(2);
    });

    it("should save event to localstorage", async () => {
      //init
      const date = new Date(2023, 0, 11);
      const dateStr = dateString(date);
      const weekStart = weekStartOf(dateStr).toISODate();
      const event = new Event({
        id: generateId(dateStr),
        weekStart: weekStart,
        place: "Some Str 15",
        start: "10:00",
        end: "12:00",
        date: dateStr,
        memberIds: [],
        color: "var(--green)"
    });
      const eventsService = new EventService();

      //invoke
      eventsService._saveToLocalStorage(event);

      //check
      const res = await eventsService._loadFromLocalStorage(dateString(new Date(2023, 0, 9)));
      expect(res.length).toBe(3);
  });
});