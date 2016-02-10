var UserService = require('../Api/UserService');
var Firebase = require('firebase');
var ref = new Firebase('https://whoup.firebaseio.com/');

var AuthService = {
  accountCallback: function(callback) {
    return function(error, authData) {
      UserService.getUser(authData, callback, error);
    };
  },

  accountSignupCallback: function(callback, username) {
    return function(error, authData) {
      if (!authData) return callback({
        message: "Username: " + username + " already taken"
      });
      ref.child('usernames').child(username).transaction(function(data) {
        if (data === null) {
          ref.child('users').child(authData.uid).set({
            email: authData.password.email,
            username: username
          });
          UserService.getUser(authData, callback, error);
          return {
            id: authData.uid
          };
        } else {

        }
      }, function(error, committed, snapshot) {
        if (error)
          callback(error);
        else if (!committed)
          callback({
            message: "Username: " + username + " already taken"
          });
      });
    };
  },

  signup: function(email, username, password, callback) {
    ref.createUser({
      email: email,
      password: password
    }, (error, userData) => {
      if (error) return callback(error);
      ref.authWithPassword({
          email: email,
          password: password
        },
        AuthService.accountSignupCallback(callback, username));
    });
  },

  login: function(email, password, callback) {
    //ref.unauth();
    ref.authWithPassword({
      email: email,
      password: password
    }, AuthService.accountCallback(callback));
  }
};

module.exports = AuthService;
