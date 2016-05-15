'use-strict';
var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TabBarIOS,
  NavigatorIOS,
  ListView,
  ActivityIndicatorIOS
} = React;

var LoadingScreen = React.createClass({
  render: function() {

    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS
          animating={true}
          style={styles.spinner}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    height: 40,
    width: 40,
  }
});

module.exports = LoadingScreen;
