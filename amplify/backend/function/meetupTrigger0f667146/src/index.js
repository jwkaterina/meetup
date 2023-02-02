/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MEETUP_ARN
	STORAGE_MEETUP_NAME
	STORAGE_MEETUP_STREAMARN
Amplify Params - DO NOT EDIT */

const WebpushSubscriptionEntity = require('./webpush-subscription');
const MeetupChangeEvent = require('./meetup-change');
const { sendPush, getNewSubscriptionData } = require('./webpush-actions');

const {
  getEntity,
} = require('./dynamodb-actions');

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));

  await checkNewWebPushSubscriptionEvents(event);
  await checkMeetupChangeEvents(event);

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

async function checkMeetupChangeEvents(event) {
  const changes = event.Records.map(record => {
    if(record.eventName !== 'REMOVE' && record.eventName !== 'MODIFY') {
      return null;
    }
    return MeetupChangeEvent.parseDynamoDbEvent(record.eventName, record.dynamodb);
  })
  .filter(change => change ? true : false);

  for(const change of changes) {
    try {
      const subs = await change.getSubscriptions();
      console.log("Change:", change);
      console.log("Subscriptions:", subs);
      for (const sub of subs) {
        await sendPush(sub, change.meetupChangeEntity);
      }
    } catch (err) {
      console.log('Cannot send push notification:', err);
    }
  }
}