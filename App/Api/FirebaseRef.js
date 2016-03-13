var Firebase = require('firebase');
var ref = new Firebase('https://whoup.firebaseIO.com/');

//var CurrentUserStore = require('../Stores/CurrentUserStore');
var Network = require('../Api/Network');
var DeviceUUID = require("react-native-device-uuid");
var RemotePushIOS = require("../RemotePushIOS");
// var CurrentUserStore = require('../Stores/CurrentUserStore');
// var CURRENT_USER = CurrentUserStore.get().data;


module.exports = {

  ref: function() {
    return ref;
  },

  goOnline: function(uid) {
    var amOnline = ref.child('.info').child('connected')
    var userRef = ref.child('presence').child(uid);
    amOnline.on('value', function(snapshot) {
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
        userRef.set(true);
      }
    });
  },

  userRef: function(uid) {
    return ref.child('users').child(uid);
  },

  username: function(username) {
    return ref.child('usernames').child(username);
  },

  userFriendRef: function(uid) {
    return ref.child('users').child(uid).child('friends');
  },

  userFriendReqRef: function(uid) {
    return ref.child('users').child(uid).child('friend_reqs');
  },

  signOut: function(uid, uuid) {
    var onlineRef = ref.child('presence').child(uid);
    var devicePushRef = ref.child('users').child(uid).child('deviceTokens').child(uuid);
    onlineRef.remove();
    devicePushRef.remove();
    ref.unauth();
    return;
  },

  auth: function(token, callback) {
    Network.started();
    ref.authWithCustomToken(token, function(error, result) {
      Network.completed();
      callback();
      return;
    });
  },
  // registerForPushNotifs: function(uid){
  //   DeviceUUID.getUUID().then((uuid) => {
  //     RemotePushIOS.requestPermissions(function(err, data) {
  //       if (err) {
  //         console.log('shit')
  //       } else {
  //         // On success, data will contain your device token. You're probably going to want to send this to your server.
  //         var pushRef =ref.child('users').child(uid).child('deviceTokens').child(uuid);
  //         pushRef.transaction(function(curr_val) {
  //           if (curr_val !== null || curr_val !== undefined) {
  //             return data.token;
  //           }
  //         })
  //       }
  //     });

  //   });

  // },

  registerForPush: function(uuid, uid, token) {
    var pushRef =ref.child('users').child(uid).child('deviceTokens').child(uuid);
    pushRef.transaction( (curr_val) => {
        return token;
    }, (error, committed, snapshot) => { return; })
  },
  pushRef: function() {
    return ref.child('push-notifs').child('tasks');
  }

};
