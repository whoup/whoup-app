var React  = require('react-native');
var {
  View,
  Image,
  StyleSheet,
  TouchableHighlight
} = React;
var AppActions = require('../Actions/AppActions');
var AppConstants = require('../Constants/AppConstants');
var cssVar = require('../Lib/cssVar');
var Text = require('../Components/Text');

var Welcome = React.createClass({
  launch_login: function() {
    AppActions.launchRelativeItem(this.props.currentRoute, {subPath: 'login'});
  },
  launch_signup: function() {
    AppActions.launchRelativeItem(this.props.currentRoute, {subPath: 'signup'});
  },

  render: function() {
    return (
      <Image style={styles.container} source={{uri: 'launch'}}>
        <View style={styles.spacer} />
        <View style={styles.center} >
          <Image style={styles.icon} source={{uri: 'owl'}} />
          <Text style={styles.copy}>
           Who Up?
          </Text>
        </View>
        <View style={styles.spacer} />
        <TouchableHighlight style={[styles.login, styles.buttonStyle]} onPress={this.launch_login}>
          <Text style={styles.buttonText}>
            Log In
          </Text>
        </TouchableHighlight>
        <TouchableHighlight style={[styles.signup, styles.buttonStyle]} onPress={this.launch_signup} >
          <Text style={styles.buttonText}>
            Sign Up
          </Text>
        </TouchableHighlight>
      </Image>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    //backgroundColor: cssVar('thm5'),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  copy: {
    backgroundColor: 'transparent',
    fontSize: 60,
    color: cssVar('thm5')
  },
  icon: {
    width: 75,
    height: 75,
    bottom: -25,
    backgroundColor: 'transparent'
  },
  spacer: {
    flex: 1
  },
  login: {
    backgroundColor: cssVar('thm5'),
    borderBottomWidth: 5,
  },
  signup: {
    backgroundColor: cssVar('thm1'),
  },
  buttonStyle: {
    flex: 0.25,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: cssVar('thm2'),
    fontSize: 18,
  }
});

module.exports = Welcome;
