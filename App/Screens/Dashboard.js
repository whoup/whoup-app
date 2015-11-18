var React = require('react-native');
var {
  View,
  StyleSheet,
  ListView
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


var ChatRoomList = React.createClass({
  mixins: [NavigationListener, NavBarHelper],

  getDefaultProps: function() {
    return {
      store: FriendListStore,
      listProps: {
        nextIcon: true
      },
    };
  },

  getListItems: function() {
    uid = this.getUserId();
    //FriendActions.mountFriendAdd(uid);
    return FriendListStore.get('friend');
  },

  isListChange: function(username) {
    return this.getUsername() == username;
  },

  getItemProps: function(friend) {
    return {
      key: friend.data.id,
      title: friend.data.username,
      online: friend.data.online,
      subPath: friend.data.username,
      passProps: {
        id: friend.data.id,
        username: friend.data.username
      }
    }
  },

   reloadList: function() {
    console.log("reloading friends: ");
    FriendActions.fetchList(CurrentUserStore.get().data.id, function(error) {
      // TODO: handle error
      if (error) {
        alert(error.message);
        this.setState({noFriends: true})
      }
    }.bind(this));
  },

  imUp: function() {
    ChatActions.goOnline(CURRENT_USER.id,);
  },

  getInitialState: function() {
    this.getUserStatus();
    return this.getListState();
  },

  getListState: function() {
    return {
      items: this.getListItems(),
      noFriends: false,
    };
  },

  onListChange: function(arg) {
    if (!this.isListChange || this.isListChange(arg)) {
      this.setState(this.getListState());
    }
  },
  _onChange: function() {
    this.setState(this.getListState());
  },

  onDidFocusNavigation: function() {
    // items may have changed
    this.setState(this.getListState());
  },

  getUserStatus: function() {
    return
  },

  componentDidMount: function() {
    this.props.store.addChangeListener(this._onChange);
    if (this.reloadList) {
      this.reloadList();
    };
    // if (this.props.navBarHidden) {
    //   AppActions.hideNavBar();
    // };
  },

  componentWillUnmount: function() {
    this.props.store.removeChangeListener(this._onChange);
  },

  getNavBarState: function() {
    var title = this.props.navBarTitle ? this.props.navBarTitle : "Who Up?";
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
      <SimpleList
        style={styles.flex}
        currentRoute={this.props.currentRoute}
        getItemProps={this.getItemProps}
        items={this.state.items}
        reloadList={this.reloadList}
        {...this.props.listProps}
      />
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
    var content;
    var empty;
    if (this.state.items.length === 0) {
      content = this.renderEmpty();
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

  renderNotTime: function() {
    return (
    <View style={[styles.flex, styles.container]}>
      <Text style={[styles.description]}>
      {"It's not time. Come back at midnight"}
      </Text>
    </View>)
  },

  renderList: function() {
    var d0 = new Date("01/01/2001 " + "12:00 AM");
    var d1 = new Date("01/01/2001 " + "6:00 PM");
    var d = new Date("01/01/2001");
    d.setHours(new Date().getHours());
    d.setMinutes(new Date().getMinutes());
    var itsTime = d0 < d1  ? (d0 <= d && d < d1) : (d1 <= d && d < d0) == false
    if (itsTime) {
      if (this.state.items === null) {
        return (<View style={[styles.flex, styles.container]}>
                  <Text style={[styles.description]}>
                   { "No Friends :(" }
                  </Text>
                </View>
                );
      }
      else if (this.state.items === undefined) {
        return <Loading />;
      }
      else {
        return this.renderContent();
      }
    }
    else {
      return this.renderNotTime();
    }

  },

  renderYouUp: function() {
    return ( <View style={[styles.flex, styles.container, styles.offsetBottom]}>
                  <Text style={[styles.question]}>
                    {'you up?'}
                  </Text>
                  <Button onPress={this.imUp} style={styles.button}>
                      {'Yes'}
                  </Button>
                </View>
            );
  },

  render: function() {
    var content;
    if (this.state.userIsUp) {
      content = this.renderList();
    } else {
      content = this.renderYouUp();
    }
   return content;
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: cssVar('thm2')
  },
  question: {
    fontSize: 40,
    paddingBottom: 20,
    fontWeight: '900',
    color: cssVar('thm1')
  },
  button: {
    width: 100,
    backgroundColor: cssVar('thm2'),
  },
  offsetBottom: {
    paddingBottom: 100
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E9F3',
  }
});

module.exports = ChatRoomList;
