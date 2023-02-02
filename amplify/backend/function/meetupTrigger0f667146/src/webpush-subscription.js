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

    /**
    * Use this API to check if a dynamoDb event is of
    * WebpushSubscriptionEntity type.
    * If yes, the entity returned.
    * Otherwise null returned.
    */
    static parseDynamoDbEvent(evt) {
        if(!evt) {
            console.log('No dynamoDB event!');
            return null;
        }

        const keys = Item.parseDynamoDbEvent(evt);

        if(!keys) {
            return null;
        }

        if(!keys.pk.startsWith(WebpushSubscriptionEntity.PK_PREFIX)) {
            return null;
        }

        if(!keys.sk.startsWith(WebpushSubscriptionEntity.SK_PREFIX)) {
            return null;
        }

        if(!evt.NewImage) {
            console.log('Broken WebpushSubscription DynamoDb Event Item. No dynamodb.NewImage');
            return null;
        }

        if(!evt.NewImage.endpoint) {
            console.log('Broken WebpushSubscription DynamoDb Event Item. No dynamodb.NewImage.endpoint');
            return null;
        }

        if(!evt.NewImage.endpoint.S) {
            console.log('Broken WebpushSubscription DynamoDb Event Item. No dynamodb.NewImage.endpoint.S');
            return null;
        }

        const endpoint = evt.NewImage.endpoint.S;

        if(!evt.NewImage.keys) {
            console.log('Broken WebpushSubscription DynamoDb Event Item. No dynamodb.NewImage.keys');
            return null;
        }

        if(!evt.NewImage.keys.M) {
            console.log('Broken WebpushSubscription DynamoDb Event Item. No dynamodb.NewImage.keys.M');
            return null;
        }

        if(!evt.NewImage.keys.M.auth) {
            console.log('Broken WebpushSubscription DynamoDb Event Item. No dynamodb.NewImage.keys.M.auth');
            return null;
        }

        if(!evt.NewImage.keys.M.auth.S) {
            console.log('Broken WebpushSubscription DynamoDb Event Item. No dynamodb.NewImage.keys.M.auth.S');
            return null;
        }

        const auth = evt.NewImage.keys.M.auth.S;

        if(!evt.NewImage.keys.M.p256dh) {
            console.log('Broken WebpushSubscription DynamoDb Event Item. No dynamodb.NewImage.keys.M.p256dh');
            return null;
        }

        if(!evt.NewImage.keys.M.p256dh.S) {
            console.log('Broken WebpushSubscription DynamoDb Event Item. No dynamodb.NewImage.keys.M.p256dh.S');
            return null;
        }

        const p256dh = evt.NewImage.keys.M.p256dh.S;

        const subscription = { endpoint, expirationTime: null, keys: {auth, p256dh}}

        return new WebpushSubscriptionEntity(keys.pk, keys.sk, subscription);
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
}

module.exports = WebpushSubscriptionEntity;