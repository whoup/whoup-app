var React = require('react-native');

var NavigationBar = require('../Navigation/NavigationBar');
var StatusBar = require('../Platform/StatusBar');

var LoggedOut = React.createClass({
  mixins: [NavigationBar],


  getInitialState: function() {
    return {
      navBarHidden: true,
      notif: null,
      notifVisible: false
    };
  },

});

module.exports = LoggedOut;
