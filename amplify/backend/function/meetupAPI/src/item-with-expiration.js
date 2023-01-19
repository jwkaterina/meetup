const Item = require('./item');
const { DateTime } = require("luxon");

class ItemWithExpiration {
    constructor(pk, sk, date, expiresAt = null) {
        this.item = new Item(pk, sk);
        if(!expiresAt) {
            this.expiresAt = DateTime.fromISO(date).plus({months: 2}).toSeconds();
        } else {
            this.expiresAt = expiresAt;
        }
    }

    static parseDynamoDbItem(item) {
        if(!item) {
            throw new Error('No item!');
        }

        const {pk, sk, rest} = Item.parseDynamoDbItem(item);
        const {ExpirationTime, ...itemRest} = rest;

        return {pk, sk, expiresAt: ExpirationTime, rest: itemRest};
    }

    get pk() {
        return this.item.pk
    }

    get sk() {
        return this.item.sk
    }

    keys() {
        return {
            ...this.item.keys(),
            ExpirationTime: this.expiresAt
        }
    }
}

module.exports = ItemWithExpiration;