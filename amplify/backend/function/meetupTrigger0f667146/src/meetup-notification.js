const {
    queryEntities,
    queryEntitiesWithConditionExpression,
    getEntity,
    deleteEntity,
    putEntity,
    postEntity,
} = require('./dynamodb-actions');

const WebpushSubscriptionEntity = require('./webpush-subscription');

class MeetupNotification {
    constructor(userIds, meetupChangeEntity) {
        this.userIds = userIds;
        this.meetupChangeEntity = meetupChangeEntity;
    }

    async getSubscriptions() {
        if(!this.userIds || this.userIds.length == 0) {
            return result;
        }

        const promises = [];
        
        /*
        * It's tricky to use async with array.foreEach (or similar) functions.
        * Using simple loop instead.
        * See: https://stackoverflow.com/a/37576787
        */
        for (const userId of this.userIds) {
            promises.push(this.getWebPushSubscriptions(userId));
        }

        const result = await Promise.all(promises);

        /*
        * result is an array of arrays: [ [...], [...], [...] ]
        * making it flat:
        */
        return result.reduce((acc, current) => {
            acc.push(...current);
            return acc;
        }, []);
    }

    async getWebPushSubscriptions (userId) {
        const expression = "PK = :pk AND begins_with(SK, :sk)";
        const attributes = {
            ':pk': WebpushSubscriptionEntity.generatePk(userId),
            ':sk': WebpushSubscriptionEntity.SK_PREFIX
        }
        try {
          const queryRes = await queryEntitiesWithConditionExpression(expression, attributes);
          return queryRes.Items.map(item => WebpushSubscriptionEntity.fromItem(item))
        } catch (err) {
          console.log("Could not load WebPush Subscriptions from Database:", err);
          return null;
        }
    }

    static async processWebPushError(err, sub) {
        if(err.statusCode && err.statusCode == 410) {
            console.log("Trying to delete unvalid subscription:", sub);
            await MeetupNotification.deleteSubscription(sub);
        } else {
            console.log('Cannot send push notification:', err);
        }
    }

    static async deleteSubscription(sub) {
        const params = {
            "PK": sub.pk,
            "SK": sub.sk
        };

        try {
            await deleteEntity(params)
            console.log("Successfully deleted subscribtion:", sub.toDto());
        } catch(err) {
            console.log("Cannot delete Subscribtion:", e);
        }
    }
}

module.exports = MeetupNotification;