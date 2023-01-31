'use strict';
const aws = require('aws-sdk');
const webpush = require('web-push');
const ssm = new aws.SSM();

exports.handler = async (event, context, cb) => {
  console.log(`Invoke: ${JSON.stringify(event)}`);
  
  const props = event.ResourceProperties;
  const paramPrefix = `/amplify/meetupSecrets/${props.ENV}/webPushKeys`;
  const pubKeyName = `${paramPrefix}/public`;
  const priveKeyName = `${paramPrefix}/private`;

  if (event.RequestType == "Create") {
    try {
        const keysExist = await checkWebPushKeysExist([pubKeyName, priveKeyName]);
        if (!keysExist) {
            const keys = generateNewKeys();
            await storeNew(keys.public, pubKeyName);
            await storeNew(keys.private, priveKeyName);
        }
        sendResponse(event, context, "SUCCESS", { pubKeyName, priveKeyName }, event.PhysicalResourceId);
        cb();
    } catch(err) {
        sendResponse(event, context, "FAILED", {}, event.PhysicalResourceId);
        cb(err);
    }
  } else if (event.RequestType == "Update") {
    sendResponse(event, context, "SUCCESS", { pubKeyName, priveKeyName }, event.PhysicalResourceId);
    cb();
  } else if (event.RequestType == "Delete") {
    try {
      await ssm.deleteParameter({ Name: pubKeyName }).promise();
      await ssm.deleteParameter({ Name: priveKeyName }).promise();
      sendResponse(event, context, "SUCCESS", {}, event.PhysicalResourceId);
      cb();
    } catch(err) {
      sendResponse(event, context, "SUCCESS", {}, event.PhysicalResourceId);
      cb(err);
    }
  }
};

function generateNewKeys() {
  console.log(`Generating new keys...`);
  const keys = webpush.generateVAPIDKeys();

  return {
    public: keys.publicKey,
    private: keys.privateKey
  };
}

async function storeNew(value, name) {
  const params = {
    Name: name,
    Type: "SecureString",
    Value: value,
    Overwrite: false
  };
  await ssm.putParameter(params).promise();
}

async function checkWebPushKeysExist(names) {
    const { Parameters } = await ssm.getParameters({
    Names: names,
    WithDecryption: true,
    }).promise();

    console.log('Existing SSM WebPush Keys:', Parameters);
    return Parameters.length != 0;
}

function sendResponse(event, context, responseStatus, responseData, physicalResourceId, noEcho) {
 
  const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
      PhysicalResourceId: physicalResourceId || context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      NoEcho: noEcho || false,
      Data: responseData
  });

  console.log("Response body:\n", responseBody);

  const https = require("https");
  const url = require("url");

  const parsedUrl = url.parse(event.ResponseURL);
  const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: "PUT",
      headers: {
          "content-type": "",
          "content-length": responseBody.length
      }
  };

  const request = https.request(options, function(response) {
      console.log("Status code: " + response.statusCode);
      console.log("Status message: " + response.statusMessage);
      context.done();
  });

  request.on("error", function(error) {
      console.log("send(..) failed executing https.request(..): " + error);
      context.done();
  });

  request.write(responseBody);
  request.end();
}
