const { DateTime } = require('luxon');
const Item = require('./item');
const MeetupChangeEntity = require('./meetup-change-entity');

class MeetupEntity {
    constructor(pk, sk, date, place, start, end) {
        this.item = new Item(pk, sk);
        this.date = date;
        this.place = place;
        this.start = start;
        this.end = end;
    }

    static get PK_PREFIX() {
        return "weekstart_";
    }

    static get SK_PREFIX() {
        return "event_";
    }

    static generatePk(weekStart) {
        return MeetupEntity.PK_PREFIX + weekStart;
    }

    static generateSk(time) {
        return MeetupEntity.SK_PREFIX + time;
    }

    get pk() {
        return this.item.pk
    }

    get sk() {
        return this.item.sk
    }

    get id() {
        return this.item.sk.substring(MeetupEntity.SK_PREFIX.length);
    }

    get weekStart() {
        return this.item.pk.substring(MeetupEntity.PK_PREFIX.length);
    }

    get expired() {
        const eventDate = DateTime.fromISO(this.date);
        const now = DateTime.now();

        return eventDate.plus({ days: 1}) < now
    }

    /**
     * Compares this entity with another one.
     * @param {*} that Another entity of the same type to compare with.
     * @returns An array of changes
     */
    diff(that) {
        const changes = {};
        let changesFound = false;
        if (this.date !== that.date) {
            changesFound = true;
            changes["date"] = {oldValue: this.date, newValue: that.date}
        }
        if (this.start !== that.start) {
            changesFound = true;
            changes["start"] = {oldValue: this.start, newValue: that.start}
        }
        if (this.end !== that.end) {
            changesFound = true;
            changes["end"] = {oldValue: this.end, newValue: that.end}
        }
        if (this.place !== that.place) {
            changesFound = true;
            changes["place"] = {oldValue: this.place, newValue: that.place}
        }

        if (!changesFound) {
            return null;
        }

        return changes;
    }
}

module.exports = MeetupEntity;