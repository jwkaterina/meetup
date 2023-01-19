
const AWS = require('aws-sdk')
const https = require('https');
AWS.config.update({ region: process.env.TABLE_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient({
    service: new AWS.DynamoDB({
      region: process.env.TABLE_REGION,
      httpOptions: {
        agent: new https.Agent({ keepAlive: true }),
        timeout: 1000,
        connectionTimeout: 1000,
      }
    })
});

let tableName = "meetup";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
}

async function queryEvents(condition) {
    let getItemParams = {
        TableName: tableName,
        KeyConditions: condition
    }

    const res = await dynamodb.query(getItemParams).promise();

    return res;
}

async function getEvent(params) {
    let getItemParams = {
        TableName: tableName,
        Key: params
    }

    const res = await dynamodb.get(getItemParams).promise();

    return res;
}

async function putEvent(event) {
    let putItemParams = {
        TableName: tableName,
        Item: event.toDynamoDbItem()
    }
    const res = await dynamodb.put(putItemParams).promise();

    return res;
}

async function postEvent(event) {
    let putItemParams = {
        TableName: tableName,
        Item: event.toDynamoDbItem(),
        ConditionExpression: "attribute_not_exists(SK)"
    }
    const res = await dynamodb.put(putItemParams).promise();

    return res;
}

async function deleteEvent(params) {
    let removeItemParams = {
        TableName: tableName,
        Key: params
    }
    const res = await dynamodb.delete(removeItemParams).promise();

    return res;
}

module.exports = {
    queryEvents,
    getEvent,
    deleteEvent,
    putEvent,
    postEvent,
};