/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const serviceAccount = require("./uehsgram-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://uehsgram-default-rtdb.europe-west1.firebasedatabase.app'
});


exports.storePostData = functions.https.onRequest((req, res) => {   // storePostData - is my API 
  cors(req, res, async () => { 
    try{
      const{id, title, location, image} = req.body;

      // -----testing GPT----
      // Validate input
      if (!id || !title || !location || !image) {
        throw new Error('Missing required fields: id, title, location, or image');
      }
      // ------------------------finished testing GPT------------



      // Push Data to the Realtime Database
      await admin.database().ref('posts').push({  // admin -> OfflineAudioCompletionEvent
        id,
        title,
        location,
        image
      });

      res.status(201).json({message: "Data Stored", id});
    }catch (error){
      console.log('Error storing post:', error.message);  // test GPT
      res.status(500).json({error: error.message});
    }
  });
});
