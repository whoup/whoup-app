var Firebase = require('firebase');
var ref = new Firebase('https://whoup.firebaseIO.com/');

var FirebaseRef = {

  ref: function() {
    return ref;
  },

  userRef: function(uid) {
    return ref.child('users').child(uid);
  },

  userFriendRef: function(uid) {
    return ref.child('users').child(uid).child('friends')
  },

  userFriendReqRef: function(uid) {
    return ref.child('users').child(uid).child('friend_reqs')
  },

  unauth: function() {
    return ref.unauth();
  }

};

module.exports = FirebaseRef;

