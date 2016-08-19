var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var webPush = require('web-push');

var config = require('./push-server.config.js');

var app = express();
app.use(bodyParser.json());

// TODO move into env var.
webPush.setGCMAPIKey(config.GCM_API_KEY);

app.options('/push', cors());
app.post('/push', cors(), function(req, res) {
  setTimeout(function() {
    webPush.sendNotification(req.body.endpoint, {
      TTL: req.body.ttl,
      payload: req.body.payload,
      userPublicKey: req.body.key,
      userAuth: req.body.authSecret,
    })
    .then(function() {
      console.log('/push 201 OK', { payload: req.body.payload });
      res.sendStatus(201);
    })
    .catch(function(err) {
      console.log('/push Error', err);
    });
  }, req.body.delay * 1000);
});

app.listen(3000, function() {
  console.log('Push server listening on port 3000...');
});
