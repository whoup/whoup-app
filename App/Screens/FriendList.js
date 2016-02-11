var React = require('react-native');
var {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} = React;



var cssVar = require('../Lib/cssVar');
var Text       = require('../Components/Text');
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

import Dimensions from 'Dimensions';



var FriendList = React.createClass({

  getInitialState: function() {
    return{
            friends: [],
            requests: [],
            loading: true,
          }
  },

  componentDidMount: function(){

    base.fetch('users/' + CURRENT_USER.id + '/friends', {
      context: this,
      asArray: true,
      then(data){
        if (data){
          this.setState({friends: data, loading: false})
        }
      }
    });
    base.fetch('users/' + CURRENT_USER.id + '/friend_reqs', {
      context: this,
      asArray: true,
      then(data){
        if (data){
          this.setState({requests: data, loading: false})
        }
      }
    });
  },

  renderEmpty: function() {
    return(
      <View/>
    );
  },

  getItemProps: function(friend){
    return {
      key: friend.key,
      id: friend.key,
      name: friend.username,
    }
  },

  getItems: function() {
    if (this.state.requests.length === 0 )
     return {friends: this.state.friends };
    else return { requests: this.state.requests, friends: this.state.friends};
  },

  renderItems: function() {
    return (
      <SectionedList
        style={[styles.flex]}
        currentRoute={this.props.currentRoute}
        getItemProps={this.getItemProps}
        items={this.getItems()}
        {...this.props.listProps}
      />
    );
  },


   renderContent: function() {
    var content;
    var empty;
    if (this.state.loading) {
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

  // <TouchableOpacity style={styles.flex} onPress={this.goBack} >
            // <Image style={[styles.imageCIcon]} source={{uri: 'eyes'}} />
          // </TouchableOpacity>
  renderTitle: function() {
    //var name = this.props.passProps == undefined ? null : this.props.passProps.username
    return (
      <View style={styles.navBar} >
          <TouchableOpacity onPress={this.launchActivityView} >
            <Image style={[styles.imageLIcon]} source={{uri: 'invite'}} />
          </TouchableOpacity>
          <Text style={styles.title} >
            My Friends
          </Text>
          <TouchableOpacity onPress={this.goBack} >
            <Icon name={'ios-arrow-right'} size={25} color={cssVar('thm3')} style={[styles.imageRIcon]} />
          </TouchableOpacity>
      </View>
    );
  },



  render: function() {
    // var noReqs;
    // var reqStore = FriendRequestStore;
    // var anyRequests = reqStore.get('request');
    // var anyFriends = reqStore.get('friend');
    // if (anyRequests === null || anyRequests === 'undefined'|| anyRequests.length === 0) {
    //   noReqs = false;
    // }
    // else {
    //   noReqs = true;
    // }

    return (
      <Image style={[styles.flex, styles.paddTop]} source={{uri: 'yellow'}}>
        {this.renderTitle()}
        <View style={[styles.header]}>
          <Image style={[styles.imageCIcon]} source={{uri: 'eyes'}} />
        </View>
        <View style={[styles.container, styles.flex]}>
          <FriendList {...this.props} />
          <TouchableOpacity style={styles.button} onPress={this.friendAdd}>
            <Image style={[styles.add]} source={{uri: 'plus_b'}} />
          </TouchableOpacity>
        </View>
      </Image>
            );
  }
});
var SCR_WDTH = Dimensions.get('window').width;
var SCR_HGTH = Dimensions.get('window').height;
var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  navBar: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: cssVar('thm2'),
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
    width: SCR_WDTH * .13,
    height: SCR_WDTH * .13,
    left: SCR_WDTH / 2 - SCR_WDTH * .065 ,
    //top: SCR_HGTH * 0.75,
    borderRadius: SCR_WDTH * .13,
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
    bottom: 50
  },
   title: {
    fontSize: 18,
    color: cssVar('thm1'),
    flex: 1,
    textAlign: 'center',
    marginBottom: 5
  },
  imageRIcon: {
    marginRight: 17,
    marginTop: -3,
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
  header: {
    backgroundColor: 'transparent',
    paddingTop: 10,
  },
  spacer: {
    height: 25,
  },
});


module.exports = FriendAndRequestList;
