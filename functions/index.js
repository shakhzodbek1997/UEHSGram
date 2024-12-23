const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const webpush = require("web-push");
const fs = require("fs");
const UUID = require("uuid-v4");
const os = require("os");
const Busboy = require("busboy");
const path = require("path");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require("./uehsgram-fb-key.json")),
  databaseURL: "https://uehsgram-default-rtdb.europe-west1.firebasedatabase.app/"
});

// Cloud function to store post data
exports.storePostData = functions.https.onRequest((request, response) => {
  // Enable CORS for handling cross-origin requestsbu
  cors(request, response, async () => {
    const uuid = UUID();
    const busboy = new Busboy({ headers: request.headers });

    let upload;
    const fields = {};

    // Handle file upload
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
      const filepath = path.join(os.tmpdir(), filename);
      upload = { file: filepath, type: mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });

    // Handle other form fields
    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    // After upload finishes
    busboy.on("finish", async () => {
      try {
        // Upload the file to Firebase Storage
        const bucket = admin.storage().bucket();
        const file = bucket.file(upload.file);

        // Upload the file to Firebase Storage
        await bucket.upload(upload.file, {
          destination: file,
          metadata: {
            contentType: upload.type,
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
        });

        // Construct the file's public URL
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;

        // Store post data in the Firebase Realtime Database
        await admin.database().ref("posts").push({
          title: fields.title,
          location: fields.location,
          rawLocation: {
            lat: fields.rawLocationLat,
            lng: fields.rawLocationLng,
          },
          image: fileUrl,
        });

        // Send push notifications
        webpush.setVapidDetails(
          "mailto:yuldoshov.shakhzod@gmail.com",
          "BPELivJlGUezg5W3ZgM9s5k6K3-PTYPNkSNJstNIwM71AAzxHG9amaaLcAUKHLhAv0ay4ZG3cUEQfrEPpPxrIm4",
          "Aokjsli1EL4re5poDZzZFiiA-h_wDDN0obhAUTc1LqE"
        );

        const subscriptionsSnapshot = await admin.database().ref("subscriptions").once("value");
        const subscriptions = subscriptionsSnapshot.val();

        for (const sub of Object.values(subscriptions)) {
          const pushConfig = {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.keys.auth,
              p256dh: sub.keys.p256dh,
            },
          };

          try {
            await webpush.sendNotification(pushConfig, JSON.stringify({
              title: "New Post",
              content: "New Post added!",
              openUrl: "/help",
            }));
          } catch (err) {
            console.log("Error sending notification:", err);
          }
        }

        response.status(201).json({ message: "Data stored", id: fields.id });
      } catch (err) {
        console.log("Error uploading file or storing data:", err);
        response.status(500).json({ error: err.message });
      }
    });

    // End the busboy process
    busboy.end(request.rawBody);
  });
});
