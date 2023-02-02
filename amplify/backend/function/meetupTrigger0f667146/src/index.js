/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MEETUP_ARN
	STORAGE_MEETUP_NAME
	STORAGE_MEETUP_STREAMARN
Amplify Params - DO NOT EDIT */

const WebpushSubscriptionEntity = require('./webpush-subscription');
const MeetupChangeEvent = require('./meetup-change');
const WebPushActions = require('./webpush-actions');
const MeetupNotification = require('./meetup-notification');

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));

  const webPush = new WebPushActions();
  await webPush.fetchKeys();

  await checkNewWebPushSubscriptionEvents(event, webPush);
  await checkMeetupChangeEvents(event, webPush);

  context.done(null, 'Successfully processed DynamoDB record');
};

async function checkNewWebPushSubscriptionEvents(event, webPush) {
  const subs = event.Records.map(record => {
    if(record.eventName !== 'INSERT') {
      return null;
    }
    return WebpushSubscriptionEntity.parseDynamoDbEvent(record.dynamodb);
  })
  .filter(sub => sub ? true : false);

  const payload = JSON.stringify(webPush.getNewSubscriptionData());

  for(const sub of subs) {
    try {
      await webPush.sendPush(sub.toDto(), payload);
    } catch (err) {
      console.log('Cannot send push notification:', err);
    }
  }
}

async function checkMeetupChangeEvents(event, webPush) {
  const changes = event.Records.map(record => {
    if(record.eventName !== 'REMOVE' && record.eventName !== 'MODIFY') {
      return null;
    }
    return MeetupChangeEvent.parseDynamoDbEvent(record.eventName, record.dynamodb);
  })
  .filter(change => change ? true : false);

  for(const change of changes) {
    const subs = []
    try {
      subs.push(...await change.getSubscriptions());
    } catch (err) {
      console.log('Cannot get WebPush Subscribtions:', err);
    }

    for (const sub of subs) {
      try {
        await webPush.sendPush(sub.toDto(), JSON.stringify(change.meetupChangeEntity));
        console.log('Successfully sent WebPush Notification:', sub);
      } catch (err) {
        await MeetupNotification.processWebPushError(err, sub);
      }
    }
  }
}