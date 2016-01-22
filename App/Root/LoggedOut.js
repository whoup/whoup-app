var React = require('react-native');

var NavigationBar = require('../Navigation/NavigationBar');
var StatusBar = require('../Platform/StatusBar');

var LoggedOut = React.createClass({
  mixins: [NavigationBar],

  getDefaultProps: function() {
    return {navBarHidden: true};
  },
  getInitialState: function() {
    StatusBar.setStyle('default');
    return {
      navBarHidden: true
    };
  },

});

module.exports = LoggedOut;
