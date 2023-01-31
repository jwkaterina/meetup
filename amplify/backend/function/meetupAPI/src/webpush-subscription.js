const Item = require('./item');
const EntityError = require('./entity-error');

class WebpushSubscriptionEntity {
    constructor(pk, sk, rest) {
        this.item = new Item(pk, sk);
        this.rest = rest;
    }

    static get PK_PREFIX() {
        return "user";
    }

    static get SK_PREFIX() {
        return "webpush_subscription";
    }

    static generatePk(userId) {
        return `${WebpushSubscriptionEntity.PK_PREFIX}_${userId}`;
    }

    static generateSk(id) {
        return `${WebpushSubscriptionEntity.SK_PREFIX}_${id}`;
    }

    static fromItem(item) {
        if(!item) {
            throw new EntityError('No dynamoDB item!');
        }

        const {pk, sk, rest} = Item.parseDynamoDbItem(item);

        return new WebpushSubscriptionEntity(pk, sk, rest);
    }

    static fromUpdateDto(dto, userId) {
        if(!dto) {
            throw new EntityError('No dto!');
        }

        if(!userId) {
            throw new EntityError('userId not defined');
        }

        const endpoint = dto.endpoint;

        if(!endpoint) {
            throw new EntityError('endpoint not defined');
        }

        const subscriptionId = endpoint.split("/").pop();

        if(!subscriptionId) {
            throw new EntityError('subscriptionId not defined');
        }

        const pk = WebpushSubscriptionEntity.generatePk(userId);
        const sk = WebpushSubscriptionEntity.generateSk(subscriptionId);

        return new WebpushSubscriptionEntity(pk, sk, dto);
    }

    get pk() {
        return this.item.pk
    }

    get sk() {
        return this.item.sk
    }

    get subscriptionId() {
        return this.item.sk.substring(WebpushSubscriptionEntity.SK_PREFIX.length);
    }

    get userId() {
        return this.item.pk.substring(WebpushSubscriptionEntity.PK_PREFIX.length);
    }

    toDynamoDbItem() {
        return {
            ...this.item.keys(),
            ...this.rest
        }
    }

    toDto() {
        return {
            ...this.rest
        }
    }

    updateFrom(subscription) {
        this.rest = subscription.rest
    }
}

module.exports = WebpushSubscriptionEntity;