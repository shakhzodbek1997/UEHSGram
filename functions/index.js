const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const webpush = require("web-push");

const serviceAccount = require("./uehsgram-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://uehsgram-default-rtdb.europe-west1.firebasedatabase.app",
});

exports.storePostData = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Push data to the Firebase Realtime Database
      const postRef = await admin.database().ref("posts").push({
        id: req.body.id,
        title: req.body.title,
        location: req.body.location,
        image: req.body.image,
      });

      webpush.setVapidDetails(
        "mailto:yuldoshov.shakhzod@gmail.com",
        "BGnFb-bozoht4xVSf5VWwtFHTbXiRo12kHtGe5UQ__C19O9kE_MMPziiqDliPsCK7VI3w-RwvgVvr6lwqna5T_g", // Public VAPID Key
        "13yWarhc5acR9LVcypncIrx9ItLRh3B6Du2THO_U31E" // Private VAPID Key
      );

      const subscriptions = await admin.database().ref("subscriptions").once("value");

      subscriptions.forEach((sub) => {
        const pushConfig = {
          endpoint: sub.val().endpoint,
          keys: {
            auth: sub.val().keys.auth,
            p256dh: sub.val().keys.p256dh,
          },
        };

        webpush
          .sendNotification(pushConfig, JSON.stringify({ 
            title: "New Post", 
            content: "New Post added!",
            openUrl:  '/help' // whenever click the notification
          }))
          .catch((err) => {
            console.error("Error sending notification:", err);
          });
      });

      res.status(201).json({ message: "Data stored", id: req.body.id });
    } catch (err) {
      console.error("Error storing data:", err);
      res.status(500).json({ error: err.message });
    }
  });
});