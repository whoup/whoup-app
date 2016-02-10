var React = require('react-native');
var {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} = React;
var cssVar = require('../Lib/cssVar');

var Button      = require('../Components/Button');
var FriendActions = require('../Actions/FriendActions');
var AppActions  = require('../Actions/AppActions');
var NavBarHelper = require('../Mixins/NavBarHelper');
var Icon = require('react-native-vector-icons/Ionicons');
var Text             = require('../Components/Text');

var SearchBar = require('react-native-search-bar');
var KeyboardListener = require('../Mixins/KeyboardListener');

RequestItem = require('../Components/RequestItem.js')

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

  updateText: function(text) {
    text = text.replace(/[\[\].#/]/g, '').toLowerCase();;
  if (text !== '' && text !== CURRENT_USER.username){
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
    if (this.state.username){
      return (
              <RequestItem username={this.state.username} id={this.state.userId} currUid={CURRENT_USER.id} />
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
});

module.exports = FriendAdd;
