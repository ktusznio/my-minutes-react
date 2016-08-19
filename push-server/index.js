var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var expressValidator = require('express-validator');
var webPush = require('web-push');

var config = require('./push-server.config.js');

var app = express();
app.use(bodyParser.json());
app.use(expressValidator());

webPush.setGCMAPIKey(config.GCM_API_KEY);

var timeouts = {};

app.options('/push', cors());
app.post('/push', cors(), function(req, res) {
  req.checkBody('taskId', 'Missing taskId').notEmpty();
  req.checkBody('endpoint', 'Missing endpoint').notEmpty();
  req.checkBody('startedAt', 'startedAt must be a timestamp').notEmpty().isInt();
  req.checkBody('payload', 'Missing payload').notEmpty();
  req.checkBody('userPublicKey', 'Missing userPublicKey').notEmpty();
  req.checkBody('userAuth', 'Missing userAuth').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  var taskId = req.body.taskId;
  var endpoint = req.body.endpoint;
  var startedAt = req.body.startedAt;
  var payload = req.body.payload;
  var userPublicKey = req.body.userPublicKey;
  var userAuth = req.body.userAuth;

  var desiredDelay = req.body.delay || 0;
  var now = Date.now();
  var diff = now - startedAt;
  var delay = desiredDelay - diff;

  var timeout = setTimeout(function() {
    webPush.sendNotification(endpoint, {
      payload: payload,
      userPublicKey: userPublicKey,
      userAuth: userAuth,
    })
    .catch(function(err) {
      console.error('Error sending push', err, { payload: payload });
    });
  }, delay);

  cancelPush(taskId);
  timeouts[taskId] = timeout;

  console.log('/push: scheduled', taskId);

  res.sendStatus(201);
});

app.options('/cancel', cors());
app.post('/cancel', cors(), function(req, res) {
  req.checkBody('taskId', 'Missing taskId').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  var taskId = req.body.taskId;
  cancelPush(taskId);

  console.log('/cancel:', taskId);

  res.sendStatus(201);
});

function cancelPush(taskId) {
  if (timeouts[taskId]) {
    clearTimeout(timeouts[taskId]);
  }
}

app.listen(3000, function() {
  console.log('Push server listening on port 3000...');
});
