var Dispatcher   = require('../Dispatcher');
var AppConstants = require('../Constants/AppConstants');
var AuthService  = require('../Api/AuthService');
var Network = require('../Api/Network');
var FirebaseRef = require('../Api/FirebaseRef');

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

  submitLogin: function(username, password, callback) {
    Network.started();
    AuthService.login(username, password, this.authCallback(callback));
  },

  submitSignUp: function(email, username, password, callback) {
    Network.started();
    AuthService.signup(email, username, password, this.authCallback(callback));
  }
};

module.exports = AuthActions;
