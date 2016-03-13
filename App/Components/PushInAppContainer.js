var React = require('react-native');
var {
  View,
  StyleSheet,
  Animated,
  Image,
  TouchableWithoutFeedback
} = React;

var Text = require('../Components/Text');
var cssVar = require('../Lib/cssVar');
var TimerMixin = require('react-timer-mixin');
var RemotePushIOS = require("../RemotePushIOS");
var StatusBar = require('../Platform/StatusBar');
var AppActions = require('../Actions/AppActions');
//var Animatable = require('react-native-animatable');
import Dimensions from 'Dimensions';
var PushInAppContainer = React.createClass({
   mixins: [TimerMixin],

   getInitialState: function(){
    this.height = new Animated.Value(0);
    return {
      message: '',
      fromId: '',
      from: '',
      type: '',

    }

   },
  _setAnimation(enable) {
    Animated.timing(this.height, {
      duration: 100,
      toValue: enable? 64 : 0
    }).start()
  },


  componentWillMount: function() {
    RemotePushIOS.setListenerForNotifications(this.receiveRemoteNotification);
  },

  receiveRemoteNotification: function(notification) {
     // Your code to run when the alert fires


     // Determine whether notification was received on startup. Note that it will return false if the app was running in the background. To determine if the app was open or not, you'll need to keep track of the appState separately.

     console.log(notification.startup);

     if (this.props.routePath !== ('whoup/dashboard/' + notification.fromId)) {
       StatusBar.setHidden(true);
       this._setAnimation(true);
       this.setState({
                      message: notification.message,
                      type: notification.type,
                      fromId: notification.fromId,
                      from: notification.fromUser
                    })
       this.setTimeout(
          () => { this._setAnimation(false); StatusBar.setHidden(false); },
          2000);
      }
  },

  launchResponse: function(){
    this._setAnimation(false);
    StatusBar.setHidden(false);
    if (this.state.type === 'request') {
      AppActions.launchRoutePath('whoup/dashboard/friends');
    } else {
      AppActions.launchRoutePath('whoup/dashboard/' + this.state.fromId, {id: this.state.fromId, username: this.state.from});
    }
  },

  render: function (){
    return (
      <TouchableWithoutFeedback onPress={this.launchResponse}>
      <Animated.View style={[{ height: this.height }, styles.container]}>

        <Animated.Image style={[styles.owl, {height: this.height}]} source={{uri: 'owl_b_notif'}}/>
        <Animated.Text style={[styles.message, {height: this.height - 20}]}>
          {this.state.message}
          </Animated.Text>

      </Animated.View>
      </TouchableWithoutFeedback>
      );

  }
});
var SCR_WDTH = Dimensions.get('window').width;
var styles = StyleSheet.create({
  container: {
    width: SCR_WDTH,
    top: 0,
    position: 'absolute',
    backgroundColor: cssVar('thm4'),
    flexDirection: 'row'
  },
  owl: {
    width: 100,
    marginLeft: 3,
    backgroundColor: 'transparent'
  },
  message: {
    color: cssVar('thm3'),
    marginTop: 10,
    marginLeft: 10,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: cssVar('fontRegular'),
    width: SCR_WDTH * 0.65,

  }
});

module.exports = PushInAppContainer;
