
var React = require('react-native');
var NavigationBar = require('../Navigation/NavigationBar');
var StatusBar = require('../Platform/StatusBar');
var Firebase = require('firebase');
var ref = new Firebase('https://whoup.firebaseIO.com/');

var LoggedIn = React.createClass({
  mixins: [NavigationBar],

  getDefaultProps: function() {
    return {navBarHidden: false};
  },
  getInitialState: function() {
    ref.authAnonymously(()=> {return null});
    StatusBar.setStyle('light-content');
    return {
      navBarHidden: false
    };
  },
});

module.exports = LoggedIn;
