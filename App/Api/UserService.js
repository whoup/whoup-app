var Network = require('../Api/Network');
var Firebase = require('firebase');
var ref = new Firebase('https://whoup.firebaseio.com');
var UserService = {

  parseFriend: function(response) {
    if (!response) return null;
    return {
      id: response.id,
      username: response.username,
    };
  },
  parseFriends: function(response, key) {
    if (!response) return null;

    var out = {friends: []};
    for(var i in response) {
      out.friends.push(UserService.parseFriend(response[i]));
    }
    out.key = key;
    return out;
  },
  parseFriendReq: function(response, key) {
    if (!response) return null;

    var out = {friendReq: []};
    for(var i in response) {
      out.friendReq.push({id: i, username: response[i].username});
    }
    out.key = key;
    return out;
  },

  fetchFriendList: function(uid, callback) {
    ref.child('users').child(uid).child('friends').once('value', function(snapdata) {
      var data = snapdata.val();
      if (data === null || data === 'undefined') {
        callback(null, {friends: [], username: uid})
      }
      else {
        var listProps = UserService.parseFriends(data, 'friend');
        callback(null, listProps);
      }
    });
  },
  fetchRequestList: function(uid, callback) {
    ref.child('users').child(uid).child('friend_reqs').once('value', function(snapdata) {
      var data = snapdata.val();
      if (data === null || data === 'undefined') {
        callback(null, {friendReq: [], key: 'friend'})
      }
      else {
        var listProps = UserService.parseFriendReq(data, 'request');
        callback(null, listProps);
      }
    });
  },
  getUser: function(authData, callback, error) {
    if (!authData) return callback({message: "An error occurred, please try again"})
    var usersRef = ref.child('users').child(authData.uid);
    usersRef.once('value', function(snapshot) {
      var dbData = snapshot.val();
      var data = {};
      data.token = authData.token;
      data.userProps = {
        id: authData.uid,
        email: dbData.email,
        username: dbData.username,
      };
      callback(error, data);
    });
  }
};


module.exports = UserService;

