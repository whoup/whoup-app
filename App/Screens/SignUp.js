var React = require('react-native');

var AuthHelper  = require('../Mixins/AuthHelper');
var AuthActions = require('../Actions/AuthActions');

var SignUp = React.createClass({
  mixins: [AuthHelper],

  getDefaultProps: function() {
    return {
      authType: 'signup'
    };
  },

  onAuthButton: function() {
    if (this.state.chooseUsername) {
      var username = this.state.username;
      var password = this.state.password;
      var email = this.state.email;
      var password_confirm = this.state.password_confirm;
      AuthActions.submitSignup(email, username, password, function(error) {
        if (error) {
          // TODO: better errors
          alert(error.message);
        }
      });
      // TODO: setState to denote busy
    }
    else {
      this.setState({chooseUsername: true});
    }
  },

});

module.exports = SignUp;
