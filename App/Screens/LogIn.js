var React = require('react-native');

var AuthHelper  = require('../Mixins/AuthHelper');
var AuthActions = require('../Actions/AuthActions');

var LogIn = React.createClass({
  mixins: [AuthHelper],

  getDefaultProps: function() {
    return {
      authType: 'login'
    };
  },

  onAuthButton: function() {
    var username = this.state.username;
    var password = this.state.password;
    var email = this.state.email;
    AuthActions.submitLogin(email, password, function(error) {
      if (error) {
        // TODO: better errors
        alert(error.message);
      }
    });
    // TODO: setState to denote busy
  },
});

module.exports = LogIn;
