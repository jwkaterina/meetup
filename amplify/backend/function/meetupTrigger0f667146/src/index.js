/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MEETUP_ARN
	STORAGE_MEETUP_NAME
	STORAGE_MEETUP_STREAMARN
Amplify Params - DO NOT EDIT */

const WebpushSubscriptionEntity = require('./webpush-subscription');
const { sendPush, getNewSubscriptionData } = require('./webpush-actions');

const {
  getEntity,
} = require('./dynamodb-actions');

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));

  await checkNewWebPushSubscriptionEvents(event);

  context.done(null, 'Successfully processed DynamoDB record');
};

async function checkNewWebPushSubscriptionEvents(event) {
  const subs = event.Records.map(record => {
    if(record.eventName !== 'INSERT') {
      return null;
    }
    return WebpushSubscriptionEntity.parseDynamoDbEvent(record.dynamodb);
  })
  .filter(sub => sub ? true : false);

  const payload = JSON.stringify(getNewSubscriptionData());

  for(const sub of subs) {
    try {
      await sendPush(sub.toDto(), payload);
    } catch (err) {
      console.log('Cannot send push notification:', err);
    }
  }
}

async function getWebPushSubscription (pk, sk) {
  const params = {};
  params.PK = pk;
  params.SK = sk;

  try {
    const getRes = await getEntity(params);
    if (getRes.Item) {
      const entity = WebpushSubscriptionEntity.fromItem(getRes.Item);
      return entity
    } else {
      console.log("Could not load WebPush Subscription. No Item object in returned data:", getRes);
      return null;
    }
  } catch (err) {
    console.log("Could not load WebPush Subscription:", err);
    return null;
  }
}