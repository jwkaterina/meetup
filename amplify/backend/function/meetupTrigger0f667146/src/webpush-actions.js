const {SSMClient, GetParametersByPathCommand} = require('@aws-sdk/client-ssm');
const webpush = require('web-push');

class WebPushActions {
  constructor() {
    this.ssmClient = new SSMClient({});
  }

  async fetchKeys() {
    this.keys = await this.getKeys();
  }

  async getKeys() {
    const paramPrefix = `/amplify/meetupSecrets/${process.env.ENV}/webPushKeys/`;
  
    try {
      const keys = await this.ssmClient.send(
        new GetParametersByPathCommand({
          Path: paramPrefix,
          WithDecryption: true,
        })
      );

      if(keys.Parameters.length == 0) {
        console.log("WebPush Keys Are Empty");
        return null;
      }
    
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

  async getPubKey() {
    if(!this.keys) {
      throw new Error('Cannot find WebPush Keys');
    }
    if(!this.keys.public) {
      throw new Error('WebPush Public Key Not Defined');
    }
    return this.keys.public;
  }
  
  async sendPush(subscription, data) {
    if(!this.keys) {
      throw new Error('Cannot find WebPush Keys');
    }
  
    const options = {
      vapidDetails: {
        subject: 'https://developers.google.com/web/fundamentals/',
        publicKey: this.keys.public,
        privateKey: this.keys.private
      },
      // 1 hour in seconds.
      TTL: 60 * 60
    };
  
    await webpush.sendNotification(subscription, data, options);
  }

  getNewSubscriptionData() {
    return {
      type: 'WEB_PUSH_SUBSCRIBED'
    }
  }
}

module.exports = WebPushActions;