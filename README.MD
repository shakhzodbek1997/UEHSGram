# UEHSGram - Final Project for PWA [Semester 7] 

## 📋 Overview

**UEHSGram** is a **Progressive Web App** (PWA) designed to allow users to create and share posts seamlessly, even with intermittent or no internet connection. Inspired by the simplicity of Twitter, **UEHSGram** focuses on providing an efficient and lightweight experience for sharing thoughts with a title and location.

## ✨ Key Features

- **Create Posts**: Add a title and location to create your posts.
- **Offline Functionality**: Post and view cached content even when offline, with automatic syncing when reconnected.
- **Responsive Design**: Optimized for all devices—desktop, tablet, and mobile.
- **PWA Benefits**: Installable, fast loading, and engaging, providing a native app-like experience.
- **Real-Time Updates**: Enjoy real-time syncing of posts when online.


## 🚀 How to Use

You need [Node.js](https://nodejs.org) installed on your machine. Simply download the installer from [nodejs.org](https://nodejs.org) and go through the installation steps.

1. Open your command prompt or terminal and navigate into this project folder.
2. Install dependencies by running `npm install`.
3. Start the development server by running `npm start`.
4. Open the app in your browser at [http://localhost:8080](http://localhost:8080) or other available URLs that are shown in terminal after running the app.

## 🛠️ Key PWA Components

### Web App Manifest
The Web App Manifest makes your web application installable as a PWA.

### Service Workers
Service Workers act behind the scenes to enhance the app with features like:

- **Offline Support**: Cache API for offline content delivery.
- **Push Notifications**: Use web-push for sending notifications.
- **Background Synchronization**: Ensures data sync when reconnected.

#### Setting up Service Workers

1. Service Worker files must reside in the root folder to be accessible app-wide.  
   Create a `public/sw.js` file.
2. Register the Service Worker in your `app.js` file.

**Important Notes:**
- Service Workers only work on HTTPS, except for `localhost`.
- They are written in JavaScript.

### Caching with Service Workers
The Cache API is used for storing and delivering assets efficiently when offline.

### Using VAPID for Web Push Notifications

1. Install the `web-push` library by running `npm install --save web-push`.
2. Configure VAPID in `functions/package.json` by adding the script: `"web-push": "web-push"`.
3. Generate VAPID keys and push messages by running `npm run web-push`.

## 📱 Installation as PWA

1. Open the app in a browser.
2. Click the "Install" button or use the browser's "Add to Home Screen" option.
3. Access MyPWA directly from your home screen like a native app.

## 📖 License

This project is licensed under the [MIT License](LICENSE).  

Happy posting! 😊

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
* OFFLINE CACHING
* OFFLINE ANALYTICS
* BACKGROUND SYNC

Enhancing Workbox: 
to minify
> npm install --save-dev uglify-js  
> Package.json 
"scripts": {
  "minify": "uglifyjs public/src/js/app.js -o public/src/js/app.min.js --compress --mangle && uglifyjs public/src/js/feed.js -o public/src/js/feed.min.js --compress --mangle && uglifyjs public/src/js/fetch.js -o public/src/js/fetch.min.js --compress --mangle && uglifyjs public/src/js/idb.js -o public/src/js/idb.min.js --compress --mangle && uglifyjs public/src/js/promise.js -o public/src/js/promise.min.js --compress --mangle && uglifyjs public/src/js/utility.js -o public/src/js/utility.min.js --compress --mangle",
  "build": "npm run minify && npm run generate-sw"
}
 

>> finally 
firebase deploy


Sec - 9 Background Sync. allows you to one important thing, sync your data even if users offline sending it.
in root folder:  > npm install -g firebase-tools
                 > firebase inti  >are you ready? y > *functions:, *Hosting:

Installing Firebase-admin and Cors by using this command in **functions** folder: 
                 > npm install firebase-admin cors --save   then changed functions/index.js file 
                 > firebase deploy ---->  

                 Hosting URL: https://uehsgram.web.app 
                 Project Console: https://console.firebase.google.com/project/uehsgram/overview
new URL to send REQUEST:  Function URL (storePostData(us-central1)): https://us-central1-uehsgram.cloudfunctions.net/storePostData
DatabaseURL:     https://uehsgram-default-rtdb.europe-west1.firebasedatabase.app


------Push Notification ----
THe coolest features Native apps can access and ca use? Push notifications, there is no better way of getting your users back into your application. You have your mobile phone in your pocket and suddenly it vibrates, you have a look at it and you see there is this new article you definitely have to read  in your favorite app. Well just tap on notification and  you are on the article. from  developer perspective, that's awesome, that's the best way to drive user engagement and re-engage users with your application. And from a user perspective, you get informed about things which matter to you, at least if it's done in a good way.

if users have our web app, so the tab or the whole browser closed. there a service process, a background process of the Chrome browser will keep on running in the background even if the application is closed and we'll use our service worker to receive incoming push notifications, to alert the user.

-------Notification API
We used notification API to create and show new notifications, set a title, a body, possibly images and more. Important I just mentioned it, you don't need a service worker for that, you can use that notification API directly from your normal page JS (in my case Chrome didn't allow me to use). We used in our project service workers.

service Worker's ShowNotification('Message', options) method do not show up in the browser
> Reacting to Notification Interaction by Clicking managed by Service Worker (sw.js), because, a notification is a system feature, it's not displayed in our web application, it's displayed by operating system. hence the user may interact with it when our page isn't even opened, because Service workers are running in the background.

 ----- vapid Keys----
We used VAPID keys to protect our push messages and make sure we only send them from our application server and no one else can send them. Our backend, that's our Firebased cloud function:  functions/index.js is our backend code.
> functions > npm install --save web-push --> this will install web push package it will allow us to generate vapid keys and send the push messages themselves.
> after installation configure package.json file like this:
    
    "scripts": {
        "web-push": "web-push"
    }

to execute the package:   in functions folder run this command: > npm run web-push generate-vapid-keys
      Public Key:    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  || app.js -> vapidPublicKey
      Private Key:   xxxxxxxxxxxxxxxxxxxx
------ Sending Push Messaged from the SERVER --------- functions/index.js -------
