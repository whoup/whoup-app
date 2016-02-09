var React = require('react-native');
var {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} = React;


var ListHelper = require('../Mixins/ListHelper');
var cssVar = require('../Lib/cssVar');
var Text       = require('../Components/Text');
var FriendListStore = require('../Stores/FriendListStore');
var FriendRequestStore = require('../Stores/FriendRequestStore');
var FriendActions   = require('../Actions/FriendActions');
var Icon = require('react-native-vector-icons/Ionicons');
var ActivityView = require('react-native-activity-view');
var Loading          = require('../Screens/Loading');
var Text             = require('../Components/Text');
var SectionedList       = require('../Components/SectionedList');

var AppActions = require('../Actions/AppActions');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var CURRENT_USER = CurrentUserStore.get().data;

var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var FriendList = React.createClass({

  getDefaultProps: function() {
    return {
      navBarTitle: '',
      listProps: {
        nextIcon: false
      },
    };
  },
  getInitialState: function() {
    return{
            friends: [],
            requests: [],
          }
  },

  componentDidMount: function(){
    this.friendRef = base.bindToState('users/' + CURRENT_USER.id + '/friends', {
      context: this,
      state: 'friends',
      asArray: true
    });
    this.reqRef = base.bindToState('users/' + CURRENT_USER.id + '/requests', {
      context: this,
      state: 'requests',
      asArray: true
    });
  },
  componentWillUnmount: function(){
    base.removeBinding(this.friendRef);
    base.removeBinding(this.reqRef);
  },

  renderEmpty: function() {
    return(
      <View/>
    );
  },

  getItemProps: function(friend){
    return {
      key: friend.key,
      type: 'friend',
      name: friend.username,
    }
  },

  renderItems: function() {
    return (
      <SectionedList
        style={styles.flex}
        currentRoute={this.props.currentRoute}
        getItemProps={this.getItemProps}
        items={{requests: this.state.requests, friends: this.state.friends}}
        {...this.props.listProps}
      />
    );
  },


   renderContent: function() {
    var content;
    var empty;
    if (this.state.friends.length === 0) {
      content = this.renderItems();//this.renderEmpty();
    }
    else {
      content = this.renderItems();
    }
    return (
      <View style={styles.flex}>
        {content}
      </View>
    );
  },

  renderList: function() {
    // if (this.state.users === null) {
    //   return (<View/>
    //           );
    // }
    // else if (this.state. === undefined) {
    //   return <Loading />;
    // }
    // else {
      return this.renderContent();
    // }
  },

  render: function() {
    return this.renderList();
  }
});

var FriendAndRequestList = React.createClass({
  getDefaultProps: function() {
    return {
      subPath: '_friendAdd'
    };
  },
  friendAdd: function(){
    AppActions.launchRelativeItem(this.props.currentRoute, this.props);
  },
  goBack: function() {
    AppActions.goBack(this.props.navigator);
  },

  launchActivityView: function(){
    ActivityView.show({
      text: "You Up? I am.",
      url: "http://whoup.club",
      image: "app_icon",
    });
  },

  renderTitle: function() {
    //var name = this.props.passProps == undefined ? null : this.props.passProps.username
    return (
      <View style={styles.navBar} >
          <TouchableOpacity onPress={this.launchActivityView} >
            <Image style={[styles.imageLIcon]} source={{uri: 'invite'}} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flex} onPress={this.goBack} >
            <Image style={[styles.imageCIcon]} source={{uri: 'eyes'}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goBack} >
            <Image style={[styles.imageRIcon]} source={{uri: 'owl_b'}} />
          </TouchableOpacity>
      </View>
    );
  },

  render: function() {
    var noReqs;
    var reqStore = FriendRequestStore;
    var anyRequests = reqStore.get('request');
    var anyFriends = reqStore.get('friend');
    if (anyRequests === null || anyRequests === 'undefined'|| anyRequests.length === 0) {
      noReqs = false;
    }
    else {
      noReqs = true;
    }

    return (
      <Image style={[styles.flex, styles.paddTop]} source={{uri: 'yellow'}}>
        {this.renderTitle()}
        <View style={[styles.container, noReqs && styles.qflex]}>

        </View>
        <View style={styles.spacer}/>
        <View style={[styles.container, styles.flex]}>
          <FriendList store={FriendListStore} {...this.props} />
        </View>
        <View style={[styles.qflex, styles.centered]}>
          <TouchableOpacity style={styles.button} onPress={this.friendAdd}>
            <Image style={[styles.add]} source={{uri: 'plus_b'}} />
          </TouchableOpacity>
        </View>
      </Image>
            );
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  navBar: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    //backgroundColor: cssVar('thm1')
  },
  paddTop: {
    marginTop: 20
  },
  qflex: {
    flex: 0.1
  },
  add: {
    width: 20,
    height: 20
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: cssVar('thm1'),
    borderWidth: 1,
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 3
    },
    backgroundColor: cssVar('thm1'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  eyesIcon: {
    flex: 1,
  },
  imageRIcon: {
    width: 30,
    height: 30,
    marginRight: 17,
    marginTop: -3,
    backgroundColor: 'transparent',
  },
  imageLIcon: {
    width: 30,
    height: 30,
    marginLeft: 17,
    marginTop: -3,
    backgroundColor: 'transparent',
  },
  imageCIcon: {
    width: 50,
    height: 25,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: 'transparent',
    paddingLeft: 10,
    paddingRight: 10
  },
  section: {
    fontSize: 12,
    color: 'rgba(0, 122, 255, 1)',
    paddingTop: 25,
    paddingBottom: 8,
    paddingLeft: 12
  },
  spacer: {
    height: 25,
  }

});


module.exports = FriendAndRequestList;
