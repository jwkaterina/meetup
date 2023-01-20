const ItemWithExpiration = require('./item-with-expiration');
const EntityError = require('./entity-error');
const { ulid } = require('ulid')
const { DateTime } = require('luxon')

class EventEntity {
    constructor(pk, sk, rest, expiresAt = null) {
        this.item = new ItemWithExpiration(pk, sk, rest.date, expiresAt);
        this.rest = rest;
    }

    static get PK_PREFIX() {
        return "weekstart_";
    }

    static get SK_PREFIX() {
        return "event_";
    }

    static fromUpdateDto(dto) {
        if(!dto) {
            throw new EntityError('No dto!');
        }

        const {id, weekStart, ...rest} = dto;

        if(!id) {
            throw new EntityError('id not defined');
        }

        if(!weekStart) {
            throw new EntityError('weekStart not defined');
        }

        if(!rest.date) {
            throw new EntityError('date not defined');
        }

        const pk = EventEntity.generatePk(weekStart);
        const sk = EventEntity.generateSk(id);

        return new EventEntity(pk, sk, rest);
    }

    static fromInsertDto(dto) {
        if(!dto) {
            throw new EntityError('No dto!');
        }

        const {weekStart, ...rest} = dto;

        if(!weekStart) {
            throw new EntityError('weekStart not defined');
        }

        if(!rest.date) {
            throw new EntityError('date not defined');
        }

        if(!rest.start) {
            throw new EntityError('start not defined');
        }

        const time = EventEntity.parseTime(rest.date, rest.start);
        const pk = EventEntity.generatePk(weekStart);
        const sk = EventEntity.generateSk(ulid(time));

        return new EventEntity(pk, sk, rest);
    }

    static parseTime(date, time) {
        try {
            const dateTime = DateTime.fromISO(`${date}T${time}`);
            return dateTime.toMillis();
        } catch(err) {
            throw new EntityError(`Cannot parse DateTime from: ${date}T${time}`);
        }
    }

    static generatePk(weekStart) {
        return EventEntity.PK_PREFIX + weekStart;
    }

    static generateSk(time) {
        return EventEntity.SK_PREFIX + time;
    }

    static fromItem(item) {
        if(!item) {
            throw new EntityError('No dynamoDB item!');
        }

        const {pk, sk, expiresAt, rest} = ItemWithExpiration.parseDynamoDbItem(item);

        return new EventEntity(pk, sk, rest, expiresAt);
    }

    get pk() {
        return this.item.pk
    }

    get sk() {
        return this.item.sk
    }

    get id() {
        return this.item.sk.substring(EventEntity.SK_PREFIX.length);
    }

    get weekStart() {
        return this.item.pk.substring(EventEntity.PK_PREFIX.length);
    }

    toDynamoDbItem() {
        return {
            ...this.item.keys(),
            ...this.rest
        }
    }

    toDto() {
        return {
            id: this.id,
            weekStart: this.weekStart,
            ...this.rest
        }
    }

    updateFrom(event) {
        if(event.rest.date !== this.rest.date) {
            throw new EntityError("Date change is forbidden!");
        }
        this.rest = event.rest
    }
}

module.exports = EventEntity;