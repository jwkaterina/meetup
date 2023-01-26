/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_MEETUP_ARN
	STORAGE_MEETUP_NAME
	STORAGE_MEETUP_STREAMARN
Amplify Params - DO NOT EDIT */
const {SSMClient, GetParametersByPathCommand} = require('@aws-sdk/client-ssm');

const client = new SSMClient({});

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));

  const keys = await getWebPushKeys();

  if (keys) {
    console.log("WebPush Keys:", keys);
  }

  console.log("WEB_PUSH_PUBLIC_KEY_NAME", process.env.ENV);
  event.Records.forEach(record => {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
  });
  context.done(null, 'Successfully processed DynamoDB record');
};

async function getWebPushKeys() {
  const paramPrefix = `/amplify/meetupSecrets/${process.env.ENV}/webPushKeys/`;

  try {
    const keys = await client.send(
      new GetParametersByPathCommand({
        Path: paramPrefix,
        WithDecryption: true,
      })
    );
  
    return keys.Parameters.reduce((acc, param) => {
      const key = param.Name.split('/').pop();
      acc[key] = param.Value;
      return acc;
    }, {});
  } catch(err) {
    console.log("Cannot get SSM Params:", err);
    return null
  }
}