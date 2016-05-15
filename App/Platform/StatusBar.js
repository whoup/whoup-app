var React = require('react-native');
var {
  StatusBar
} = React;

var StatBar = {
  setNetworkActive: function(active) {
    StatusBar.setNetworkActivityIndicatorVisible(active);
  },
  setStyle: function(style) {
    StatusBar.setBarStyle(style, true);
  },
  setHidden: function(hidden){
    StatusBar.setHidden(hidden, 'slide');
  }
};

module.exports = StatBar;
