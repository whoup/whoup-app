var React = require('react-native');
var {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  InteractionManager
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

var RequestItem = require('../Components/RequestItem.js')

var CurrentUserStore = require('../Stores/CurrentUserStore');
//var CURRENT_USER = CurrentUserStore.get().data;

var Firebase = require('firebase');
var users = new Firebase('https://whoup.firebaseIO.com/usernames')

var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var FriendAdd = React.createClass({
  mixins: [KeyboardListener],

  getInitialState: function() {
    return {
      text: '',
      username: '',
      userId: '',
      loading: true,
      friends: {},
      reqs: {},
      reqSent: {}
    };
  },

  componentDidMount: function(){
    var userId = this.getUserId()
    InteractionManager.runAfterInteractions(() => {
      this.friends = base.bindToState('users/' + userId + '/friends/', {
        context: this,
        asArray: false,
        state: 'friends'
      });
      this.reqs = base.bindToState('users/' + userId + '/sent_reqs/', {
        context: this,
        asArray: false,
        state: 'reqs'
      });
      this.reqSent = base.bindToState('users/' + userId + '/friend_reqs/', {
        context: this,
        asArray: false,
        state: 'reqSent'
      });
    });
  },

  componentWillUnmount: function() {
    //this.props.store.removeChangeListener(this._onChange);
    base.removeBinding(this.reqs);
    base.removeBinding(this.reqSent);
    base.removeBinding(this.friends);
    // console.log(this.state);
  },


  updateText: function(text) {
    text = text.replace(/[\[\].#@/]/g, '').toLowerCase();;
  if (text !== '' && text !== this.getUsername()){
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
      var isFriend = (this.state.friends[this.state.userId] !== undefined || this.state.reqs[this.state.userId] || this.state.reqSent[this.state.userId]);
      return (
              <RequestItem
                username={this.state.username}
                id={this.state.userId}
                currUid={this.getUserId()}
                currUsername={this.getUsername()}
                isFriend={isFriend} loading={this.state.loading}
                />
            )
    } else {
      return (
              <View style={[styles.flex, styles.gray]}>
                <Text style={[styles.curr_username]}>
                  @{this.getUsername()}
                </Text>
                <Text style={styles.subtitle} >
                  is your username
                </Text>
              </View>
              )
    }
  },

  getUsername: function() {
    return CurrentUserStore.get().data.username;
  },
  getUserId: function() {
    return CurrentUserStore.get().data.id;
  },

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
    backgroundColor: cssVar('thm5')
  },
  title: {
    fontSize: 22,
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
