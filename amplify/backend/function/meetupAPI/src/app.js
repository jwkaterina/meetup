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
  const pk = EventEntity.generatePk(req.params[partitionKeyName]);
  condition[partitionKeyName]['AttributeValueList'] = [ pk ];

  try {
    const queryRes = await queryEvents(condition);
    const events = queryRes.Items.map((item) => EventEntity.fromItem(item).toDto());
    res.json({success: true, url: req.url, data: events});
  } catch (e) {
    res.statusCode = 500;
    console.log("Could not load items:", e);
    res.json({success: false, error: 'Could not load items: ' + err.message, url: req.url, req: req});
  }
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, async (req, res) => {
  const params = {};
  const pk = EventEntity.generatePk(req.params[partitionKeyName]);
  const sk = EventEntity.generateSk(req.params[sortKeyName]);
  params[partitionKeyName] = pk;
  params[sortKeyName] = sk;

  try {
    const getRes = await getEvent(params);
    if (getRes.Item) {
      res.json({success: true, url: req.url, data: EventEntity.fromItem(getRes.Item).toDto()});
    } else {
      res.statusCode = 500;
      console.log("Could not load event. No Item object in returned data:", getRes);
      res.json({success: false, error: 'Could not load event. No Item object in returned data: ' + JSON.stringify(getRes), url: req.url, req: req});
    }
  } catch (e) {
    res.statusCode = 500;
    res.json({success: false, error: 'Could not load item: ' + err.message, url: req.url, req: req});
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
      console.log("Could not load event:", getRes);
      res.json({success: false, error: 'Could not load event: ' + JSON.stringify(getRes), url: req.url, req: req});
      return;
    }

    const existingEvent = EventEntity.fromItem(getRes.Item);
    existingEvent.updateFrom(event);

    await putEvent(existingEvent)
    res.json({success: true, url: req.url, data: existingEvent.toDto()})

  } catch (e) {
    if(e instanceof EntityError) {
      res.statusCode = 400;
    } else {
      res.statusCode = 500;
    }
    console.log("Cannot update an Event:", e);
    res.json({success: false, error: e.message, url: req.url, req: req});
  }
});

/************************************
* HTTP post method for object insert *
*************************************/

app.post(path, async (req, res) => {
  try {
    const event = EventEntity.fromInsertDto(req.body);
    await postEvent(event)
    res.json({success: true, url: req.url, data: event.toDto()})
  } catch (e) {
    if(e instanceof EntityError) {
      res.statusCode = 400;
    } else {
      res.statusCode = 500;
    }
    console.log("Cannot create an Event:", e);
    res.json({success: false, error: e.message, url: req.url, req: req});
  }
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, async (req, res) => {
  const params = {};
  const pk = EventEntity.generatePk(req.params[partitionKeyName]);
  const sk = EventEntity.generateSk(req.params[sortKeyName]);
  params[partitionKeyName] = pk;
  params[sortKeyName] = sk;

  try {
    const delRes = await deleteEvent(params)
    res.json({success: true, url: req.url, data: delRes});
  } catch(err) {
    console.log("Cannot delete an Event:", e);
    res.statusCode = 500;
    res.json({success: false, error: err.message, url: req.url, req: req});
  }
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app