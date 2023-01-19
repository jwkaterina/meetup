const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const EventEntity = require('./event-entity')
const EntityError = require('./entity-error')

const {
  queryEvents,
  getEvent,
  deleteEvent,
  putEvent,
  postEvent,
} = require('./dynamoDbActions');

const partitionKeyName = "PK";
const sortKeyName = "SK";
const path = "/events";
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = '/:' + sortKeyName;

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const checkGroup = function (req, res, next) {
  if (req.apiGateway.event.requestContext.authorizer.claims['cognito:groups']) {
    const groups = req.apiGateway.event.requestContext.authorizer.claims['cognito:groups'].split(',');
    if (!(groups.includes('admin') || groups.includes('editor') || groups.includes('user'))) {
      const err = new Error(`User does not have permissions to query database`);
      next(err);
    }
  } else {
    const err = new Error(`User does not have permissions to query database`);
    err.statusCode = 403;
    next(err);
  }
  next();
};

app.all('*', checkGroup);

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + hashKeyPath, async (req, res) => {
  const condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  condition[partitionKeyName]['AttributeValueList'] = [ req.params[partitionKeyName] ];

  try {
    const queryRes = await queryEvents(condition);
    const events = queryRes.Items.map((item) => EventEntity.fromItem(item).toDto());
    res.json(events);
  } catch (e) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err});
  }
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, async (req, res) => {
  const params = {};
  params[partitionKeyName] = req.params[partitionKeyName];
  params[sortKeyName] = req.params[sortKeyName];

  try {
    const getRes = await getEvent(params);
    if (getRes.Item) {
      res.json(EventEntity.fromItem(getRes.Item).toDto());
    } else {
      res.statusCode = 500;
      res.json({error: 'Could not load event. No Item object in returned data: ' + JSON.stringify(getRes)});
    }
  } catch (e) {
    res.statusCode = 500;
    res.json({error: 'Could not load item: ' + err.message});
  }
});


/************************************
* HTTP put method for object update *
*************************************/

app.put(path, async (req, res) => {
  try {
    const event = EventEntity.fromUpdateDto(req.body);
    const params = {};
    params[partitionKeyName] = event.pk;
    params[sortKeyName] = event.sk;

    const getRes = await getEvent(params);
    if (!getRes.Item) {
      res.statusCode = 500;
      res.json({error: 'Could not load event. No Item object in returned data: ' + JSON.stringify(getRes)});
      return;
    }

    const existingEvent = EventEntity.fromItem(getRes.Item);
    existingEvent.updateFrom(event);

    const putRes = await putEvent(existingEvent)
    res.json({success: 'put call succeed!', url: req.url, data: putRes})

  } catch (e) {
    if(e instanceof EntityError) {
      res.statusCode = 400;
    } else {
      res.statusCode = 500;
    }
    res.json({error: e.message, url: req.url, body: req.body});
  }
});

/************************************
* HTTP post method for object insert *
*************************************/

app.post(path, async (req, res) => {
  try {
    const event = EventEntity.fromInsertDto(req.body);
    const putRes = await postEvent(event)
    res.json({success: 'post call succeed!', url: req.url, data: putRes})
  } catch (e) {
    if(e instanceof EntityError) {
      res.statusCode = 400;
    } else {
      res.statusCode = 500;
    }
    res.json({error: e.message, url: req.url, body: req.body});
  }
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, async (req, res) => {
  const params = {};
  params[partitionKeyName] = req.params[partitionKeyName];
  params[sortKeyName] = req.params[sortKeyName];

  try {
    const delRes = await deleteEvent(params)
    res.json({url: req.url, data: delRes});
  } catch(err) {
    res.statusCode = 500;
    res.json({error: err.message, url: req.url});
  }
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app