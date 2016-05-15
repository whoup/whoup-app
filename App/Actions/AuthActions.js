var Dispatcher   = require('../Dispatcher');
var AppConstants = require('../Constants/AppConstants');
var AuthService  = require('../Api/AuthService');
var Network = require('../Api/Network');
var FirebaseRef = require('../Api/FirebaseRef');
var CurrentUserStore = require('../Stores/CurrentUserStore');


var AuthActions = {

  authCallback: function(callback) {
    return function(error, data) {
      Network.completed();
      if(callback) callback(error, data);
      if (!error) {
        Dispatcher.dispatch({
          actionType: AppConstants.LOGIN_USER,
          userProps: data.userProps,
          token: data.token
        });
      }
    };
  },

  updateEmail: function(email) {
    var data = CurrentUserStore.get().data;
    var token = CurrentUserStore.get().token;
    data.email = email;
    FirebaseRef.userRef(data.id).child('email').set(email);
    Dispatcher.dispatch({
      actionType: AppConstants.USER_UPDATED,
      userProps: data,
      token: token
    });

  },

  submitLogin: function(username, password, callback) {
    Network.started();
    AuthService.login(username, password, AuthActions.authCallback(callback));
  },

  submitSignUp: function(email, username, password, callback) {
    Network.started();
    AuthService.signup(email, username, password, AuthActions.authCallback(callback));
  },

  resetPassword: function(email, callback) {
    FirebaseRef.ref().resetPassword({email: email}, callback);
  },

};

module.exports = AuthActions;
