var UserService = require('../Api/UserService');
var FirebaseRef = require('../Api/FirebaseRef');

var AuthService = {
  accountCallback: function(callback) {
    return function(error, authData) {
      if (error)
        return callback(error);
      UserService.getUser(authData, callback, error);
    };
  },

  accountSignupCallback: function(callback, username) {
    return function(error, authData) {
      if (!authData){
        return callback({ message: "Username: " + username + " already taken"});
      }
      FirebaseRef.ref().child('usernames').child(username).transaction(function(data) {
        if (data === null) {
          FirebaseRef.ref().child('users').child(authData.uid).set({
            email: authData.password.email,
            username: username
          });
          UserService.getUser(authData, callback, error);
          return {
            id: authData.uid
          };
        } else {

        }
      }, (error, committed, snapshot) => {
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
    var ref = FirebaseRef.ref();
    ref.createUser({
      email: email,
      password: password
    },
    (error, userData) => {
      if (error){
        return callback(error);
      }
      ref.authWithPassword({
          email: email,
          password: password
        },
        AuthService.accountSignupCallback(callback, username));
    });
  },

  login: function(email, password, callback) {
    FirebaseRef.ref().authWithPassword({
      email: email,
      password: password
    },
      AuthService.accountCallback(callback)
    );
  }
};

module.exports = AuthService;
