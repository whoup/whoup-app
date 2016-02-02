var React = require('react-native');
var {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} = React;
var cssVar = require('../Lib/cssVar');
//var TextInput   = require('../Components/TextInput');
var Button      = require('../Components/Button');
var FriendActions = require('../Actions/FriendActions');
var AppActions  = require('../Actions/AppActions');
var NavBarHelper = require('../Mixins/NavBarHelper');
var Icon = require('react-native-vector-icons/Ionicons');
var Text             = require('../Components/Text');

//var SearchBar = require('react-native-search-bar');
var KeyboardListener = require('../Mixins/KeyboardListener');

var Firebase = require('firebase');
var users = new Firebase('https://whoup.firebaseIO.com/usernames')

var FriendAdd = React.createClass({
  mixins: [KeyboardListener],

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

  addButton: function() {
    if (this.state.username) {
      return (
               <Icon name={'plus'} size={30} color={'black'} style={styles.button} />
      );
    } else {
      return ( <View/>)
    }
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

  renderTitle: function() {
    return (
      <View style={styles.titleView} >
        <Text style={styles.username} >
          Add Username
        </Text>
      </View>
    );
  },

  render: function() {
    var button = this.addButton();
    return (
      <View style={[styles.flex]} >
        {this.renderTitle()}
        <TextInput ref="username-input"
          placeholder={"Search"}
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
      <View style={[styles.flex, styles.inline, styles.gray]}>
        <Text style={[styles.username, styles.left, styles.mar_left]}>
          {this.state.username}
        </Text>
        <View style={[styles.mar_left, styles.right]}>
          <TouchableWithoutFeedback onPress={this.onSubmitButton}>
            {button}
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={{height: this.state.keyboardSpace, backgroundColor: cssVar('thm2')}}></View>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  input: {
    height: 30,
    fontSize: 12,
    backgroundColor: cssVar('thm3'),
    paddingBottom: 3
  },
  paddTop: {
    paddingTop: 64
  },
  username: {
    color: cssVar('thm1'),
    fontSize: 16,
  },
  titleView: {
    height: 64,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: cssVar('thm2')
  },
  inline: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  durationLabel: {
    fontSize: 18
  },
  row: {
    height: 30,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: 'black'

  },
  durationEdit: {
    height: 50,
    width: 50,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 18,

  },
  button: {
    paddingRight: 10
  },
  left: {
    flex: 1,
  },
  right: {

  },
  mar_left: {
    marginLeft: 10,
  },
  footer: {
    padding: 10,
    flexDirection: 'row'
  }
});

module.exports = FriendAdd;
