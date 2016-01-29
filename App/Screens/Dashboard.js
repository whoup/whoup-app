var React = require('react-native');
var {
  View,
  StyleSheet,
  ListView,
  Image
} = React;

var CurrentUserStore   = require('../Stores/CurrentUserStore');
var NavigationListener = require('../Mixins/NavigationListener');
var NavBarHelper       = require('../Mixins/NavBarHelper');
var Loading          = require('../Screens/Loading');
var Text             = require('../Components/Text');
var Button     = require('../Components/Button');
var SimpleList       = require('../Components/SimpleList');
var AppActions       = require('../Actions/AppActions');
var cssVar = require('../Lib/cssVar');
var FriendListStore = require('../Stores/FriendListStore');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var FriendActions = require('../Actions/FriendActions');
var ChatActions = require('../Actions/ChatActions');

var CurrentUserStore = require('../Stores/CurrentUserStore');
var CURRENT_USER = CurrentUserStore.get().data;

var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

//var ref = new Firebase("https://whoup.firebaseio.com/presence");


var ChatRoomList = React.createClass({
  mixins: [NavigationListener, NavBarHelper],

  getInitialState: function() {
    return { users: [], up: {} }
  },

  getDefaultProps: function() {
    return {
      listProps: {
        nextIcon: true
      },
    };
  },

  // isUserUp: function(key) {
  //   var up = ref.child(key).getValue();
  //   //console.log(up);
  //   return up;
  //   // var up;
  //   // base.fetch('presence/' + key, {
  //   //   context: this,
  //   //   asArray: false,
  //   //   then(data){
  //   //     if (data == null)
  //   //       up = false;
  //   //     else
  //   //       up = data;
  //   //   }
  //   // });
  //   // return up;
  // },

  getItemProps: function(friend) {
    //console.log(this.state.up[friend.key]);
    return {
      name: friend.username,
      type: 'dashboardFriend',
      id: friend.key,
      up: this.state.up[friend.key],
      subPath: friend.username,
      passProps: {
        id: friend.key,
        username: friend.username
      }
    }
  },

  //  reloadList: function() {
  //   console.log("reloading friends: ");
  //     // FriendActions.fetchList(CurrentUserStore.get().data.id, function(error) {
  //     //   // TODO: handle error
  //     //   if (error) {
  //     //     alert(error.message);
  //     //     this.setState({noFriends: true})
  //     //   }
  //     // }.bind(this));
  // },

  imUp: function() {
    ChatActions.goOnline(CURRENT_USER.id,);
    this.setState({userIsUp: true});
  },


  onDidFocusNavigation: function() {
    // items may have changed
    //this.setState(this.getListState());
  },

  componentDidMount: function() {
    this.ref = base.syncState('users/' + CURRENT_USER.id + '/friends', {
      context: this,
      state: 'users',
      asArray: true
    });
    this.ups = base.bindToState('presence', {
      context: this,
      state: 'up',
      asArray: false,
    });
  },

  componentWillUnmount: function() {
    //this.props.store.removeChangeListener(this._onChange);
    base.removeBinding(this.ref);
    base.removeBinding(this.ups);
    // console.log(this.state);
  },

  getNavBarState: function() {
    var title = this.props.navBarTitle ? this.props.navBarTitle : "";
    return { title: title };
  },

  getUsername: function() {
    if (!this.username) {
      this.username = this.props.username || CurrentUserStore.get().data.username;
    }
    return this.username;
  },
  getUserId: function() {
    return CurrentUserStore.get().data.id;
  },



  renderItems: function() {
    return (
    <View style={styles.marLeftRight}>
      <SimpleList
        style={styles.flex}
        currentRoute={this.props.currentRoute}
        getItemProps={this.getItemProps}
        items={this.state.users}
        {...this.props.listProps}
      />
      </View>
    );
  },

  renderEmpty: function() {
    return(
      <View style={styles.container} >
        <Text style={styles.description}>
          No Content
        </Text>
      </View>
    );
  },
  renderContent: function() {
    var content = this.renderItems();
    return (
      <Image style={[styles.flex,]} source={{uri: 'black'}}>
        <View style={[styles.center, styles.qflex, styles.copyOffset, styles.black, styles.paddTop]}>
          <Image style={styles.icon} source={{uri: 'owl'}} />
            <Text style={styles.copy}>
             Who Up?
            </Text>
          </View>
        {content}
      </Image>
    );
  },

  renderNotTime: function() {
    return (
    <Image style={[styles.container]} source={{uri: 'white'}}>
      <Image style={styles.icon} source={{uri: 'owl'}} />
      <Image style={[styles.notTime]} source={{uri: 'not_time'}}>
      </Image>
    </Image>)
  },

  renderList: function() {

      if (this.state.users === null) {
        return (<View style={[styles.flex, styles.container]}>
                  <Text style={[styles.description]}>
                   { "No Friends :(" }
                  </Text>
                </View>
                );
      }
      else if (this.state.users === undefined) {
        return <Loading />;
      }
      else {
        return this.renderContent();
      }

  },

  renderYouUp: function() {
    return (<Image style={[styles.flex, styles.paddTop]} source={{uri: 'black'}}>
            <View style={[styles.flex, styles.container, styles.offsetBottom]}>
              <Image
                style={styles.logo}
                source={{uri: 'sleepy_owl'}}
                />
                  <Text style={[styles.question]}>
                    {'You Up?'}
                  </Text>
                  <Button onPress={this.imUp} style={styles.button}>
                      {'YES'}
                  </Button>
                </View>
                </Image>
            );
  },

  render: function() {
    if (this.props.currentRoute.passProps.itsTime) {
      if (this.state.userIsUp) {
        content = this.renderList();
      } else {
        content = this.renderYouUp();
      }
      return content;
    }
    else {
      return this.renderNotTime();
    }
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  paddTop: {
    paddingTop: 64
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: cssVar('thm1')
  },
  black: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  notTime: {
    width: 300,
    height: 83
  },
  question: {
    fontSize: 35,
    paddingBottom: 10,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  button: {
    width: 150,
    backgroundColor: cssVar('thm1'),
  },
  offsetBottom: {
    paddingBottom: 150
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    height: 200,
    width: 100,
    backgroundColor: 'transparent',
    alignSelf: 'auto',
  },
  copy: {
    backgroundColor: 'transparent',
    fontSize: 40,
    color: cssVar('thm3')
  },
  icon: {
    width: 75,
    height: 75,
    backgroundColor: 'transparent'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  qflex: {
    flex: 0.25
  },
  marLeftRight: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15
  },
  copyOffset: {
    paddingBottom: 20
  }
});

module.exports = ChatRoomList;
