var Firebase = require('firebase');
var ref = new Firebase('https://whoup.firebaseIO.com/');

// var CurrentUserStore = require('../Stores/CurrentUserStore');
// var CURRENT_USER = CurrentUserStore.get().data;

var FirebaseRef = {

  ref: function() {
    return ref;
  },

  userRef: function(uid) {
    return ref.child('users').child(uid);
  },

  userFriendRef: function(uid) {
    return ref.child('users').child(uid).child('friends');
  },

  userFriendReqRef: function(uid) {
    return ref.child('users').child(uid).child('friend_reqs');
  },

  signOut: function(uid) {
    var userRef = new Firebase('https://whoup.firebaseio.com/presence/' + uid);
    userRef.remove();
    return ref.unauth();
  },

};

module.exports = FirebaseRef;
