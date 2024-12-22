var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});


// Display the notification using the service worker
function displayConfirmNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
      body: 'You Successfully SUBSCRIBED to our Notification Service!',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/sf-boat.jpg',
      dir: 'ltr',
      lang: 'en-US',
      vibrate: [100, 50, 200],
      badge: 'src/images/icons/app-icon-96x96.png', // android automatically mask the icon to white and black color
      tag: 'confirm-notification', //if you send more notification with the same tag, you wil lse only one notification 
      renotify: true,
      actions: [
        {action: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png'},
        {action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png'},
      ]
    };

    navigator.serviceWorker.ready
      .then(function (swReg) {
        swReg.showNotification('Successfully Subscribed!', options);
      })
      .catch(function (err) {
        console.log('Service Worker not ready', err);
      });
  }
}

function configurePushSub(){
  if(!('serviceWorker' in navigator)){
    return;
  }
  var reg;
  navigator.serviceWorker.ready
    .then(function(swReg){
      reg = swReg;
      return swReg.pushManager.getSubscription();
    })
    .then(function(sub){
      if(sub === null){
        // Create a new Subscription
        var vapidPublicKey = 'BPELivJlGUezg5W3ZgM9s5k6K3-PTYPNkSNJstNIwM71AAzxHG9amaaLcAUKHLhAv0ay4ZG3cUEQfrEPpPxrIm4';
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);  
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        });
      } else {
        // We have a subscription
      }
    })
      .then(function(newSub){
        fetch('https://uehsgram-default-rtdb.europe-west1.firebasedatabase.app/subscriptions.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
          },
          body: JSON.stringify(newSub)
        })
      })
      .then(function(res){
        if(res.ok){
          displayConfirmNotification();
        }
      })
      .catch(function(err){
        console.log(err);
      });
}

//--- Ask Notification --
function askForNotificationPermission(){
    Notification.requestPermission(function(result){
      console.log('User Choice', result);
      if(result !== 'granted'){
        console.log('No notification permission granted!');
      }else{
        configurePushSub();
        // displayConfirmNotification();
      }
    });
}

// if browser supports notifications this will appear other view it will be visible
if('Notification' in window && 'serviceWorker' in navigator){
  for(var i = 0; i < enableNotificationsButtons.length; i++){
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}