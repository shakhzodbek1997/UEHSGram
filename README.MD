# UEHSGram

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
