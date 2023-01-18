import EventService from "../../src/service/event";
import events from "../utils/events_in_local_storage.json";
import { dateString } from "../../src/helper";
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

    global.localStorage = new LocalStorageMock;
    global.localStorage.setItem('events', JSON.stringify(events));

    it("should load events from localstorage", async () => {
        //init
        const date = new Date(2023, 0, 9);
        const eventsService = new EventService();

        //invoke
        const res = eventsService.loadFromLocalStorage(date);

        //check
        expect(res.length).toBe(2);
    });

    it("should save event to localstorage", async () => {
      //init
      const date = new Date(2023, 0, 11);
      const event = new Event({
        place: "Some Str 15",
        start: "10:00",
        end: "12:00",
        date: dateString(date),
        memberIds: [],
        color: "var(--green)"
    });
      const eventsService = new EventService();

      //invoke
      eventsService.saveToLocalStorage(event);

      //check
      const res = eventsService.loadFromLocalStorage(new Date(2023, 0, 9));
      expect(res.length).toBe(3);
  });
});