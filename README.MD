# Progressive Web Apps - Final Project from PWA subject.

# How to Use
You need [Node.js](https://nodejs.org) installed on your machine. Simply download the installer from [nodejs.org](https://nodejs.org) and go through the installation steps.

Once Node.js is installed, open your command prompt or terminal and **navigate into this project folder**. There, run `npm install` to install all required dependencies.

Finally, run `npm start` to start the development server and visit [localhost:8080](http://localhost:8080) to see the running application.

Web App Manifest -> Makes your web application Installable

Service Workers -> Doing work Behind the Scenes. They allow us to make our application offline ready.and they allows us to use a lot of our next generation web application features like ( Push notification, or background synchronizations).
service workers are JS code.

service Worker should be in a root folder to be able to use everywhere.
create public > sw.js and you should register it in app.js file

Service Worker only work on HTTPS, except localhost

Caching wi th Service Workers 
Cache API 


using VAPID with webPush notification
> npm install --save web-push   .. it alow us to generate VAPID keys and push messages
configured > functions/package.json > scripts: { "web-push": "web-push" } 
npm run web-push

functions> npm install --save uuid-v4

----
var gcconfig = {
  projectId: 'uehsgram',
  keyFilename: 'uehsgram-fb-key.json'
  gcs.bucket('uehsgram.firebasestorage.app')
};

var gcs = require('@google-cloud/storage')(config);

const serviceAccount = require("./uehsgram-fb-key.json");

/ Set VAPID keys for Web Push
webpush.setVapidDetails(
  "mailto:yuldoshov.shakhzod@gmail.com",
  "BPELivJlGUezg5W3ZgM9s5k6K3-PTYPNkSNJstNIwM71AAzxHG9amaaLcAUKHLhAv0ay4ZG3cUEQfrEPpPxrIm4", // Public Key
  "Aokjsli1EL4re5poDZzZFiiA-h_wDDN0obhAUTc1LqE" // Private Key
);


workbox installed > >
npm install --save-dev workbox-cli@^2
----------------------------
1. Installable
2. Responsive
3. Ask Permission to the Camera
4. Camera Capturing
5. GET location (Warsaw), ASKS Permission to Location
6. # not storing in Firebase 
7. Ask Permission to Notification
8. Notification comes about subscription.
9. 
==============

Workbox:
