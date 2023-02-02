
const AWS = require('aws-sdk')
const https = require('https');
AWS.config.update({ region: process.env.REGION });
const serviceOptions = {
    region: process.env.REGION,
    httpOptions: {
      agent: new https.Agent({ keepAlive: true }),
      timeout: 1000,
      connectionTimeout: 1000,
    }
};
const dynamoDbService = new AWS.DynamoDB(serviceOptions);
const dynamodb = new AWS.DynamoDB.DocumentClient({ service: dynamoDbService });

const tableName = process.env.STORAGE_MEETUP_NAME;

async function queryEntities(condition) {
    let getItemParams = {
        TableName: tableName,
        KeyConditions: condition
    }

    const res = await dynamodb.query(getItemParams).promise();

    return res;
}

async function queryEntitiesWithConditionExpression(expression, attributeValues) {
    let getItemParams = {
        TableName: tableName,
        KeyConditionExpression: expression,
        ExpressionAttributeValues: attributeValues
    }

    const res = await dynamodb.query(getItemParams).promise();

    return res;
}

async function getEntity(params) {
    let getItemParams = {
        TableName: tableName,
        Key: params
    }

    const res = await dynamodb.get(getItemParams).promise();

    return res;
}

async function putEntity(entity) {
    let putItemParams = {
        TableName: tableName,
        Item: entity.toDynamoDbItem()
    }
    const res = await dynamodb.put(putItemParams).promise();

    return res;
}

async function postEntity(entity) {
    let putItemParams = {
        TableName: tableName,
        Item: entity.toDynamoDbItem(),
        ConditionExpression: "attribute_not_exists(SK)"
    }
    const res = await dynamodb.put(putItemParams).promise();

    return res;
}

async function deleteEntity(params) {
    let removeItemParams = {
        TableName: tableName,
        Key: params
    }
    const res = await dynamodb.delete(removeItemParams).promise();

    return res;
}

module.exports = {
    queryEntities,
    queryEntitiesWithConditionExpression,
    getEntity,
    deleteEntity,
    putEntity,
    postEntity,
};