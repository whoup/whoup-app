/**
 * fwd App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Component
} = React;

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 200,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  seperator: {
    height: 5,
    backgroundColor: '#dddddd'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  textInput: {
    height: 46,
    padding: 4,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 4,
    color: '#000000'
  }
});

var Home = require('./home.js');
// var MessagesView = require('./js/messages_view');
// var DiscoverView = require('./js/discover_view');
// var ProfileView = requrie('./js/profile_view')

var Forward = React.createClass({
  getInitialState: function() {
    return {
      user: '',
      password: '',
      message:'',
      isLoading: false
    };
  },


  // This will be called when the user clicks on the login button
  onLoginPressed: function () {
    this.setState({isLoading: true});
    var self = this;
    //Parse.User.logIn(this.state.user, this.state.password,
       //{success: function(user) {
        // self.props.navigator.replace({
        // title: 'Forward',
        // component: Home,
        // });
        //},
        // error: function(user, error) {
        //   self.setState({isLoading: false, message: error.message });
        // }
      //});
  },

  onUserTextChanged: function(event) {
    this.setState({user: event.nativeEvent.text});
  },
  onPwTextChanged: function(event) {
    this.setState({password: event.nativeEvent.text});
  },


  render: function() {
    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
          hidden = 'true'
          size = 'large' /> ) :
      ( <View/>);
    return (
      <View style = {styles.container}>
        <Text style = {styles.description}>
          Please Login
        </Text>
          <TextInput
            style = {styles.textInput}
            value = {this.state.user}
            onChange = {this.onUserTextChanged.bind(this)}
            placeholder = 'Username'/>
          <View style = {styles.seperator} />
          <TextInput
            secureTextEntry={true}
            style = {styles.textInput}
            value = {this.state.password}
            onChange = {this.onPwTextChanged.bind(this)}
            placeholder = 'Password'/>
          <View style = {styles.seperator} />
          <TouchableHighlight
          style = {styles.button}
          underlayColor = '#99d9f4'
          onPress = {this.onLoginPressed.bind(this)}>
          <Text style = {styles.buttonText}>Login</Text>
        </TouchableHighlight>
        {spinner}
        <Text style = {styles.description}>{this.state.message}</Text>
      </View>

    );
  }
});

module.exports = Forward;
