const {SSMClient, GetParametersByPathCommand} = require('@aws-sdk/client-ssm');
const webpush = require('web-push');

const client = new SSMClient({});
const keysPromise = getKeys();



async function getKeys() {
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

async function getPubKey() {
  const keys = await keysPromise;
  if(!keys) {
    throw new Error('Cannot find WebPush Keys');
  }
  if(!keys.public) {
    throw new Error('WebPush Public Key Not Defined');
  }
  return keys.public;
}

async function sendPush(subscription, data) {
  //in case the initial promise has not resolved yet
  const keys = await keysPromise;
  if(!keys) {
    throw new Error('Cannot find WebPush Keys');
  }

  const options = {
    vapidDetails: {
      subject: 'https://developers.google.com/web/fundamentals/',
      publicKey: keys.public,
      privateKey: keys.private
    },
    // 1 hour in seconds.
    TTL: 60 * 60
  };

  await webpush.sendNotification(subscription, data, options);
}

module.exports = {
  getPubKey,
  sendPush,
};