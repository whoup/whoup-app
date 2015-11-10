var React = require('react-native');
var {
  View,
  StyleSheet
} = React;

var TextInput   = require('../Components/TextInput');
var Text = require('../Components/Text');
var Button      = require('../Components/Button');
var FriendActions = require('../Actions/FriendActions');
var AppActions  = require('../Actions/AppActions');
var ScrollSelect = require('../Components/ScrollSelect');
var TimeInput = require('../Components/TimeInput');
var NavBarHelper = require('../Mixins/NavBarHelper');

var KeyboardListener = require('../Mixins/KeyboardListener');

var Firebase = require('firebase');
var users = new Firebase('https://whoup.firebaseIO.com/usernames')

var FriendAdd = React.createClass({
  mixins: [KeyboardListener, NavBarHelper],

  getInitialState: function() {
    return {
      text: '',
      username: '',
      userId: '',
      loading: false,
    };
  },

  onButtonSelect: function(label) {

  },
  getNavBarState: function() {
    var title = this.state.loading ? 'Searching...' : 'Add Friend';
    return { title: title };
  },

  onSubmitButton: function() {
    FriendActions.addFriend(this.state.userId, this.state.username, function(error) {
      if (error) {
        // TODO: better error handling
        alert(error.message);
      }
      else {
        AppActions.goBack(this.props.navigator);
      }
    }.bind(this));
  },

  updateText: function(text) {

  if (text !== ''){
    users.child(text).once('value', function(snapshot) {
      var data = snapshot.val();
      if (data !== null) {
        this.setState({username: text, userId: data.id, loading: false})
      } else {
        return this.setState({username: '', userId: null, loading: false});
      }
    }.bind(this));
  }
    this.setState({text: text, loading: true});
  },

  render: function() {
    return (
      <View style={styles.flex} >
        <TextInput ref="username-input"
          placeholder={"Username..."}
          keyboardType={ "twitter" }
          autoCapitalize={'none'}
          multiline={true}
          clearTextOnFocus={true}
          autoGrow={true}
          autoFocus={false}
          style={styles.input}
          returnKeyType={'send'}
          onChangeText={this.updateText}
          value={this.state.text}
          />

      <View style={[styles.flex, styles.inline]}>
        <Text style={[styles.username, styles.left]}>
          {this.state.username}
        </Text>
        <Text style={[styles.username, styles.right]} onPress={this.onSubmitButton}>
          {this.state.username && '+'}
        </Text>
      </View>
      <View style={{height: this.state.keyboardSpace}}></View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  input: {
    height: 60,
    fontSize: 16,
    backgroundColor: 'white',
    padding: 20
  },
  inline: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  durationLabel: {
    fontSize: 18
  },
  durationEdit: {
    height: 50,
    width: 50,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 18,

  },
  button: {

  },
  left: {
    flex: 1,
  },
  right: {

  },
  username: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  footer: {
    padding: 10,
    flexDirection: 'row'
  }
});

module.exports = FriendAdd;
