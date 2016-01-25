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
   // uid = this.getUserId();
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
      // FriendActions.fetchList(CurrentUserStore.get().data.id, function(error) {
      //   // TODO: handle error
      //   if (error) {
      //     alert(error.message);
      //     this.setState({noFriends: true})
      //   }
      // }.bind(this));
  },

  imUp: function() {
    ChatActions.goOnline(CURRENT_USER.id,);
    this.setState({userIsUp: true});
    this.reloadList();
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
    // if (this.props.navBarHidden) {
    //   AppActions.hideNavBar();
    // };
  },

  componentWillUnmount: function() {
    this.props.store.removeChangeListener(this._onChange);
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
      <Image style={[styles.flex, styles.paddTop]} source={{uri: 'black'}}>
        <View style={[styles.center, styles.qflex, styles.copyOffset]}>
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
    <Image style={[styles.flex, styles.paddTop, styles.container]} source={{uri: 'white'}}>
      <Image style={[styles.notTime]} source={{uri: 'not_time'}}>
      </Image>
    </Image>)
  },

  renderList: function() {

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
    console.log(this.props)
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
  copyOffset: {
    paddingBottom: 20
  }
});

module.exports = ChatRoomList;
