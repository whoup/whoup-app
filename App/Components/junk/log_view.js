'use strict';

var React = require('react-native');
var LoadingScreen = require('./loading_screen')
var {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component
} = React;

var styles = StyleSheet.create({
  fullScreen: {
    flex: 1
  }
});

var LogView = React.createClass ({
  render: function() {
      return (
      <View style = {styles.fullScreen}>
        <LoadingScreen/>
      </View>
    );

  }

})

module.exports = LogView;




