var Network = require('../Api/Network');
var FirebaseRef = require('../Api/FirebaseRef');
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

    var out = {
      friends: []
    };
    for (var i in response) {
      out.friends.push({
        id: i,
        username: response[i].username
      });
    }
    out.key = key;
    return out;
  },

  parseFriendReq: function(response, key) {
    if (!response) return null;

    var out = {
      friendReq: []
    };
    for (var i in response) {
      out.friendReq.push({
        id: i,
        username: response[i].username
      });
    }
    out.key = key;
    return out;
  },

  getUser: function(authData, callback, error) {
    FirebaseRef.userRef(authData.uid).once('value', function(snapshot) {
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
