const {onRequest} = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const webpush = require('web-push');

// Load service account key
const serviceAccount = require("./aeh-fb-key.json");

const vapidKeys = {
  publicKey: 'BJ8FhKMsubzfPPTfBdRHe3_qaA52MdhK_w3yKfnlWEvZew0unG-YnmpS4FX549NpW_lDHA1acPrM9u0S_Kv1tuE',
  privateKey: 'Oen9bJAOBniWMKyNQPhl0-Lu6kU5vz68HX-sqsy_pHs'
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://aehgram-default-rtdb.europe-west1.firebasedatabase.app/'
});

// Define HTTPS function using v2 syntax
exports.storePostData = onRequest((request, response) => {
  cors(request, response, () => {
    // Validate the request body
    if (!request.body.id || !request.body.title || !request.body.location || !request.body.image) {
      logger.warn('Invalid request data received', {requestBody: request.body});
      response.status(400).json({error: 'Invalid request data'});
      return;
    }

    // Write data to Realtime Database
    admin.database().ref('posts').push({
      id: request.body.id,
      title: request.body.title,
      location: request.body.location,
      image: request.body.image
    })
      .then(() => {
        webpush.setVapidDetails(
          'mailto:yuldoshov.shakhzod@gmail.com',
          vapidKeys.publicKey,
          vapidKeys.privateKey
        );
        return admin.database().ref('subscriptions').once('value');
      })
      .then((subscriptions)=> {
        subscriptions.forEach((sub) => {
          const pushConfig = {
            endpoint: sub.val().endpoint,
            keys: {
              auth: sub.val().keys.auth,
              p256dh: sub.val().keys.p256dh
            }
          };

          webpush.sendNotification(pushConfig, JSON.stringify({
            title: 'New Post', 
            content: 'New Post added!',
            openUrl: '/index.html'  // when click notification open index.html
          }))
            .catch((err) => {
              console.log('Error sending notification', err);
            })
        });
        logger.info('Data stored successfully', {id: request.body.id});
        response.status(201).json({message: 'Data stored', id: request.body.id});
      })
      .catch((err) => {
        logger.error('Error storing data', {error: err});
        response.status(500).json({error: 'Failed to store data'});
      });
  });
});
