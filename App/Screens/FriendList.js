var React = require('react-native');
var {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  InteractionManager,
  ActivityIndicatorIOS
} = React;



var cssVar              = require('../Lib/cssVar');
var Text                = require('../Components/Text');
var FriendActions       = require('../Actions/FriendActions');
var Icon                = require('react-native-vector-icons/Ionicons');
var ActivityView        = require('react-native-activity-view');
var Loading             = require('../Screens/Loading');
var Text                = require('../Components/Text');
var SectionedList       = require('../Components/SectionedList');
var AnimatedImage       = require('../Components/AnimatedImage');

var AppActions          = require('../Actions/AppActions');
var CurrentUserStore    = require('../Stores/CurrentUserStore');

var Rebase              = require('re-base');
var base                = Rebase.createClass('https://whoup.firebaseio.com/');


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
    InteractionManager.runAfterInteractions(() => {
      this.getFriends();
    });
  },
  componentWillUnmount: function(){
    this.setState({loading: true})
  },

  getFriends: function(){
    userId = this.getUserId();
    base.fetch('users/' + userId + '/friends', {
      context: this,
      asArray: true,
      then(data){
        if (data){
          this.setState({friends: data, loading: false})
        }
      }
    });
    base.fetch('users/' + userId + '/friend_reqs', {
      context: this,
      asArray: true,
      then(data){
        if (data){
          this.setState({requests: data, loading: false})
        }
      }
    });
  },

  renderEmpty: function(top, bottom) {
    return(
      <View style={[styles.flex, styles.centered]}>
        <Text style={[styles.copy, styles.copyTop]}>
          {top}
        </Text>
        <AnimatedImage
          style={styles.eyes}
          resizeMode={'contain'}
          active={'eyes.gif'}
          inactive={'eyes_still'}
        />
        <Text style={[styles.copy, styles.copyBottom]}>
          {bottom}
        </Text>
        <Image source={{uri: 'arrow_down'}} style={styles.arrow} />
      </View>
    );
  },

  getItemProps: function(friend){
    return {
      key: friend.key,
      id: friend.key,
      username: friend.username,
      name: friend.username
    }
  },

  getItems: function() {
    if (this.state.requests.length === 0 )
     return {friends: this.state.friends };
    else return { requests: this.state.requests, friends: this.state.friends};
  },

  getUsername: function() {
    return CurrentUserStore.get().data.username;
  },
  getUserId: function() {
    return CurrentUserStore.get().data.id;
  },

  renderItems: function() {
    return (
      <SectionedList
        style={[styles.flex]}
        currentRoute={this.props.currentRoute}
        getItemProps={this.getItemProps}
        items={this.getItems()}
        currUid={this.getUserId()}
        currUsername={this.getUsername()}
        refreshList={this.getFriends}
        {...this.props.listProps}
      />
    );
  },


   renderContent: function() {
    var content;
    if (this.state.loading) {
      content = (
        <View style={[styles.flex, styles.centered]}>
          <ActivityIndicatorIOS color={cssVar('thm2')} />
        </View>
      );
    }
    else if (this.state.friends.length < 1 && this.state.requests < 1) {
      content = this.renderEmpty("You have no friends.", "So add some below" );
    }
    else if (this.state.friends.length === 1) {
      content =
        (
          <View style={styles.paddTop}>
            {this.renderItems()}
            {this.renderEmpty("You have one lonely friend.", "So add more below" )}
          </View>
         )
    }
    else {
      content =
        (
          <View style={styles.flex}>
            <View style={[styles.header]}>
              <Image style={[styles.imageCIcon]} source={{uri: 'eyes'}} />
            </View>
            {this.renderItems()}
          </View>
        );
    }
    return (
      <View style={styles.flex}>
        {content}
      </View>
    );
  },

  renderList: function() {
      return this.renderContent();
  },

  render: function() {
    return this.renderList();
  }
});









var FriendAndRequestList = React.createClass({

  // getInitialState: function(){
  //   return {loading: true}
  // },
  getDefaultProps: function() {
    return {
      subPath: '_friendAdd'
    };
  },
  friendAdd: function(){
    //this.setState({loading: true});
    AppActions.launchRelativeItem(this.props.currentRoute, this.props);
  },
  goBack: function() {
    AppActions.goBack(this.props.navigator);
  },

  // componentDidMount: function(){
  //   InteractionManager.runAfterInteractions(() => {
  //       this.setState({loading: false})
  //   });
  // },

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
        <Text style={styles.title} >
          My Friends
        </Text>
        <TouchableOpacity onPress={this.goBack} >
          <Icon name={'ios-arrow-right'} size={30} color={cssVar('thm3')} style={[styles.imageRIcon]} />
        </TouchableOpacity>
      </View>
    );
  },



  render: function() {
    //var list = this.state.loading ? <View/> : ;
    return (
      <Image style={[styles.flex]} source={{uri: 'yellow'}}>
        {this.renderTitle()}
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
    flex: 1,
  },
  copy: {
    fontSize: 24,
  },
  copyBottom: {
    top: -25
  },
  copyTop: {
    bottom: -25
  },
  eyes: {
    width: 200,
    height: 150,
  },
  arrow: {
    width: 50,
    height: 75,
    marginTop: 40,
  },
  navBar: {
    height: 64,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: cssVar('thm2'),
  },
  qflex: {
    flex: 0.1
  },
  paddTop: {
    paddingTop: 25
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
    width: SCR_WDTH * 0.14,
    height: SCR_WDTH * 0.14,
    left: (SCR_WDTH *  0.44),// - (SCR_WDTH * 0.07) ,
    bottom: 50,
    position: 'absolute',
    borderRadius: SCR_WDTH * 0.13,
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
    textAlign: 'right',
    marginTop: -3,
    width: 30,
    height: 30,
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
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingBottom: 10,
  },
  spacer: {
    height: 25,
  },
});


module.exports = FriendAndRequestList;
