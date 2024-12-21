/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


// Initialize Firebase Admin SDK
const serviceAccount = require("./uehsgram-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://uehsgram-default-rtdb.europe-west1.firebasedatabase.app"
});


// Cloud function to store post data
exports.storePostData = onRequest((request, response) => {
  cors(request, response, () => {
    const db = admin.database();  // Using the `admin` object to access the database

    db.ref("posts")
      .push({
        id: request.body.id,
        title: request.body.title,
        location: request.body.location,
        image: request.body.image,
      })
      .then(() => {
        logger.info("Post data stored successfully", { postId: request.body.id });
        response.status(201).json({ message: "Data stored", id: request.body.id });
      })
      .catch((err) => {
        logger.error("Error storing post data", { error: err });
        response.status(500).json({ error: err });
      });
  });
});