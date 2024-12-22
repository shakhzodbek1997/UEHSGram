/**
 * Import function triggers from their respective submodules:
 * 
 * const { onCall } = require("firebase-functions/v2/https");
 * const { onDocumentWritten } = require("firebase-functions/v2/firestore");
 * 
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { getDatabase } = require("firebase-admin/database");
const { initializeApp, cert } = require("firebase-admin/app");
const cors = require("cors")({ origin: true });
const webpush = require("web-push"); // Fixed typo from `ruquire` to `require`

// Initialize Firebase Admin SDK
const serviceAccount = require("./uehsgram-fb-key.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://uehsgram-default-rtdb.europe-west1.firebasedatabase.app",
});

// Set VAPID keys for Web Push
webpush.setVapidDetails(
  "mailto:yuldoshov.shakhzod@gmail.com",
  "BPELivJlGUezg5W3ZgM9s5k6K3-PTYPNkSNJstNIwM71AAzxHG9amaaLcAUKHLhAv0ay4ZG3cUEQfrEPpPxrIm4", // Public Key
  "Aokjsli1EL4re5poDZzZFiiA-h_wDDN0obhAUTc1LqE" // Private Key
);

// Cloud function to store post data
exports.storePostData = onRequest((request, response) => {
  cors(request, response, async () => {
    const db = getDatabase();
    const postsRef = db.ref("posts");

    try {
      // Add post data to the database
      const postRef = await postsRef.push({
        id: request.body.id,
        title: request.body.title,
        location: request.body.location,
        image: request.body.image,
      });

      logger.info("Post data stored successfully", { postId: request.body.id });

      // Fetch subscriptions to send web-push notifications
      const subscriptionsRef = db.ref("subscriptions");
      const subscriptionsSnapshot = await subscriptionsRef.once("value");

      const notifications = [];
      subscriptionsSnapshot.forEach((sub) => {
        const pushConfig = {
          endpoint: sub.val().endpoint,
          keys: {
            auth: sub.val().keys.auth,
            p256dh: sub.val().keys.p256dh,
          },
        };

        // Send notification for each subscription
        notifications.push(
          webpush.sendNotification(
            pushConfig,
            JSON.stringify({
              title: "New Post",
              content: "New Post Added!",
            })
          )
        );
      });

      await Promise.all(notifications);

      // Respond with success
      response.status(201).json({ message: "Data stored", id: request.body.id });
    } catch (err) {
      logger.error("Error storing post data", { error: err });
      response.status(500).json({ error: err.message || "Internal Server Error" });
    }
  });
});
