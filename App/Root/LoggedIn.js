
var React = require('react-native');
var NavigationBar = require('../Navigation/NavigationBar');
var Firebase = require('firebase');
var ref = new Firebase('https://whoup.firebaseIO.com/');

var LoggedIn = React.createClass({
  mixins: [NavigationBar],

  getInitialState: function() {
    return {
      navBarHidden: true,
      notif: null,
      notifVisible: false
    };
  },
});

module.exports = LoggedIn;
