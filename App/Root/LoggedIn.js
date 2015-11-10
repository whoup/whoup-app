
var React = require('react-native');
var NavigationBar = require('../Navigation/NavigationBar');
var StatusBar = require('../Platform/StatusBar');

var LoggedIn = React.createClass({
  mixins: [NavigationBar],

  getDefaultProps: function() {
    return {navBarHidden: false};
  },
  getInitialState: function() {
    StatusBar.setStyle('light-content');
    return {
      navBarHidden: false
    };
  },
});

module.exports = LoggedIn;
