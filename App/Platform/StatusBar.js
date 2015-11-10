var React = require('react-native');
var {
  StatusBarIOS
} = React;

var StatusBar = {
  setNetworkActive: function(active) {
    StatusBarIOS.setNetworkActivityIndicatorVisible(active);
  },
  setStyle: function(style) {
    StatusBarIOS.setStyle(style, true)
  }
};

module.exports = StatusBar;
