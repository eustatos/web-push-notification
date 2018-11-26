const express = require('express');
const app = express();
const webPush = require('web-push');
const path = require('path');
const bodyParser = require('body-parser');

const route = '/';

const port = process.env.PORT || 5000;

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY "+
    "environment variables. You can use the following ones:");
  console.log(webPush.generateVAPIDKeys());
  return;
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  'mailto:info@eustatos.ru',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client')));

app.get(route + 'vapidPublicKey', function(req, res) {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post(route + 'register', function(req, res) {
  // A real world application would store the subscription info.
  res.sendStatus(201);
});

app.post(route + 'sendNotification', function(req, res) {
  const subscription = req.body.subscription;
  const payload = null;
  const options = {
    TTL: req.body.ttl
  };

  setTimeout(function() {
    webPush.sendNotification(subscription, payload, options)
      .then(function() {
        res.sendStatus(201);
      })
      .catch(function(error) {
        res.sendStatus(500);
        console.log(error);
      });
  }, req.body.delay * 1000);
});

app.listen(port, () => {
  console.log(`Listen at port ${port}`);
});


