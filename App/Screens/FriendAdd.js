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

var SearchBar = require('react-native-search-bar');
var KeyboardListener = require('../Mixins/KeyboardListener');

var RCTUIManager = require('NativeModules').UIManager;

var CurrentUserStore = require('../Stores/CurrentUserStore');
var CURRENT_USER = CurrentUserStore.get().data;

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
        <Image style={styles.plus} source={{uri: 'plus_b'}}/>
      );
    } else {
      return ( <View/>)
    }
  },

  updateText: function(text) {

  if (text !== ''){
    text = text.toLowerCase();
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
        <Text style={styles.title} >
          Add Username
        </Text>
      </View>
    );
  },

  renderBody: function(){
    var button = this.addButton();
    if (this.state.username){
      return (
              <View style={[styles.row, styles.inline]}>
                <Image style={styles.owl} source={{uri: 'owl_b'}}/>
                <Text style={[styles.username, styles.left, styles.mar_left]}>
                  @{this.state.username}
                </Text>
                <View style={[styles.mar_left, styles.right]}>
                  <TouchableWithoutFeedback onPress={this.onSubmitButton}>
                    {button}
                  </TouchableWithoutFeedback>
                </View>
              </View>
            )
    } else {
      return (
              <View style={[styles.flex, styles.gray]}>
                <Text style={[styles.curr_username]}>
                  @{CURRENT_USER.username}
                </Text>
                <Text style={styles.subtitle} >
                  is your username
                </Text>
              </View>
              )
    }
  },

  // <TextInput ref="username-input"
  //         placeholder={"Search"}
  //         keyboardType={ "twitter" }
  //         autoCapitalize={'none'}
  //         multiline={true}
  //         clearTextOnFocus={true}
  //         autoGrow={true}
  //         autoFocus={false}
  //         style={styles.input}
  //         returnKeyType={'send'}
  //         onChangeText={this.updateText}
  //         value={this.state.text}
  //         /><View style={[styles.flex, styles.gray]}>
  render: function() {
    return (
      <View style={[styles.flex]} >
        {this.renderTitle()}
        <View style={[styles.flex, styles.gray]}>
            <SearchBar ref='searchBar'
            placeholder='Search'
            onChangeText={this.updateText} />
          {this.renderBody()}
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
  plus: {
    width: 20,
    height: 20,
    marginRight: 15
  },
  input: {
    height: 35,
    fontSize: 15,
    backgroundColor: cssVar('thm3'),
  },
  curr_username: {
    fontSize: 20,
    marginTop: 10,
    alignSelf: 'center',
    color: cssVar('thm2'),
  },
  subtitle: {
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: 'Helvetica'
  },
  gray: {
    backgroundColor: cssVar('thm4')
  },

  username: {
    color: cssVar('thm2'),
    fontSize: 20,
    lineHeight: 0
  },
  title: {
    fontSize: 18,
    color: cssVar('thm1')
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
  },
  row: {
    marginTop: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    height: 54,
  },
  owl: {
    width: 32,
    height: 32,
    marginLeft: 10,
    marginRight: 5
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
