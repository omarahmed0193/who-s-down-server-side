var firebase = require('firebase');
var request = require('request');
var API_KEY = "AIzaSyCR5-qfyouju5ktdrj30oMllniqpi6JSFo"
var config = {
    apiKey: "AIzaSyCR5-qfyouju5ktdrj30oMllniqpi6JSFo",
    authDomain: "whos-down.firebaseapp.com",
    databaseURL: "https://whos-down.firebaseio.com",
    storageBucket: "whos-down.appspot.com",
    messagingSenderId: "229807190961"
  };
firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword("admin@user.com", "1931995omar").then(function(result) {
		// start listening
		listenForNotificationRequests();
	}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
firebase.database().ref('testnode/usernames').set({
    username: "Omar"
  });
function listenForNotificationRequests() {
  firebase.database().ref('notificationRequests').on('child_added', function(requestSnapshot) {
    var data = requestSnapshot.val();
    sendNotificationToUser(
      data.username, 
      data.message,
      data.instanceId,
      data.date,
      data.postId,
      function() {
        firebase.database().ref('notificationRequests/' + requestSnapshot.key).remove();
      }
    );
  }, function(error) {
    console.error(error);
  });
}
function sendNotificationToUser(username, message, instanceId, date, postId, onSuccess) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key='+API_KEY
    },
    body: JSON.stringify({
      data: {
        suggestion: message,
        creator: 'Created by ' + username,
        date: date,
        postId: postId
      },
      to : instanceId
    })
  }, function(error, response, body) {
    if (error) { console.error(error); }
    else if (response.statusCode >= 400) { 
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage); 
    }
    else {
      onSuccess();
    }
  });
}
