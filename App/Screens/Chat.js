var React = require('react-native');
var {
  View,
  StyleSheet,
  ActivityIndicatorIOS,
  InteractionManager,
  ListView,
  ProgressViewIOS,
  Image
} = React;

// var ChatListStore = require('../Stores/ChatListStore');
// var ChatActions   = require('../Actions/ChatActions');


var cssVar = require('../Lib/cssVar');
var CurrentUserStore   = require('../Stores/CurrentUserStore');
var NavigationListener = require('../Mixins/NavigationListener');
var NavBarHelper       = require('../Mixins/NavBarHelper');

var Loading          = require('../Screens/Loading');
var Text             = require('../Components/Text');
var SimpleList       = require('../Components/InvertedList');
var AppActions       = require('../Actions/AppActions');

var CurrentUserStore = require('../Stores/CurrentUserStore');
var CURRENT_USER = CurrentUserStore.get().data;

var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var ChatInput = require('../Components/ChatInput');
var Chat = React.createClass({
  mixins: [NavigationListener, NavBarHelper],

  // getDefaultProps: function() {

  //   return {
  //     store: ChatListStore,
  //     userId: 1,
  //     navBarTitle: 'Nutrition Team',
  //     listProps: {
  //       noTap: true
  //     }
  //   };
  // },
  getListItems: function() {
    return ChatListStore.get(this.props.room_id);
  },

  isListChange: function(username) {

    // TODO: how to know if chatlist has changed??
    return this.getUsername() == username;
  },

  getItemProps: function(message) {
    return {
      key: message.key,
      body: message.body,
      received: message.received,
      timestamp: message.timestamp

    }
  },

  reloadList: function() {
    console.log("reloading Messages: " + this.props.room_id);
    // ChatActions.fetchList(this.props.room_id, function(error) {
    //   // TODO: handle error
    //   if (error) {
    //     alert(error.message);
    //   }
    // });
  },

  getInitialState: function() {
    var state = this.getListState();
    state.renderPlaceHolder = false;
    return state
  },

  getListState: function() {
    return {
      messages: [],
      sending: false,
      progress: null,
    };
  },

  toggleSending: function() {
    this.setState({sending: (!this.state.sending)})
  },

  updateProgress: function(e) {
    this.setState({progress: e.loaded/e.total})
  },

  getNavBarState: function() {
    //var title = this.state.sending ? 'Sending...' : this.props.passProps.username;
    //return { title: title };
  },

  onListChange: function(arg) {
    if (!this.isListChange || this.isListChange(arg)) {
      this.setState(this.getListState());
    }
  },

  _onChange: function() {
    this.setState(this.getListState());
  },

  messageAdded: function() {
    //this.reloadList();
  },

  onDidFocusNavigation: function() {
    // items may have changed
    //this.setState(this.getListState());

  },

  componentDidMount: function() {
    messages = 'users/' + CURRENT_USER.id + '/messages/' + this.props.passProps.id;
    this.messageRef = base.bindToState(messages, {
      context: this,
      state: 'messages',
      asArray: true,
      queries: {
        orderByChild: 'timestamp',
        startAt: ((new Date().getTime()) - 25200000)
      }
    });
    // this.getListState();
    // InteractionManager.runAfterInteractions(() => {
    //   this.setState({renderPlaceHolder: false});
    // });
    // // Changed from whatever it is in ListHelper, change back if necessary! 10/21/15
    // this.props.store.addChangeListener(this._onChange);
    // if (this.reloadList) {
    //   this.reloadList();
    // };
  },

  componentWillUnmount: function() {
    base.removeBinding(this.messageRef);
    // Changed from whatever it is in ListHelper, change back if necessary! 10/21/15
    //this.props.store.removeChangeListener(this._onChange);
  },


  getUsername: function() {
    if (!this.username) {
      this.username = this.props.username || CurrentUserStore.get().data.username;
    }
    return this.username;
  },

  renderProgress: function() {
    if (this.state.sending) {
      return (
        <ProgressViewIOS progress={this.state.progress}/>
      );
    }
    else {
      return (
        <View />
      );
    }
  },

  renderItems: function() {
    var list;
    if (this.state.renderPlaceHolder) {
      list = (
        <SimpleList
         style={styles.flex}
         currentRoute={this.props.currentRoute}
         getItemProps={this.getItemProps}
         items={[]}
         {...this.props.listProps}
       />
      );
    }
    else {
      list = (
       <SimpleList
         style={[styles.flex, styles.white]}
         currentRoute={this.props.currentRoute}
         getItemProps={this.getItemProps}
         items={this.state.messages}
         {...this.props.listProps}
       />
     );
    }
    return list;
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

  renderTitle: function() {
    var name = this.props.passProps == undefined ? null : this.props.passProps.username
    return (
      <View style={styles.titleView} >
        <Image style={styles.owl} source={{uri: 'owl'}} />
        <Text style={styles.username} >
          {name}
        </Text>
      </View>
    );
  },

  renderContent: function() {
    var content = this.renderItems();
    var progress = this.renderProgress();
    var title = this.renderTitle();
    var name = this.props.passProps == undefined ? null : this.props.passProps.id
    // if (this.state.items.length === 0) {
    //   content = this.renderEmpty();
    // }
    // else {

    // }


    //{progress}
    return (
      <View style={[styles.flex, {backgroundColor: 'black'}]}>
        {title}
        <View style={[styles.flex, styles.white]} >
          {content}
        </View>
          <ChatInput toggleSubmitting={this.toggleSending} updateProgress={this.updateProgress}
            currUid={CURRENT_USER.id} friendId={name} />

      </View>
    );
  },

  render: function() {
    return this.renderContent();
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    color: '#FFFFFF'
  },
  owl: {
    width: 30,
    height: 30,
    bottom: -15
  },
  username: {
    color: cssVar('thm1'),
    fontSize: 24,
    marginLeft: 5,
    bottom: -10
  },
  spinner: {
    height: 40,
    width: 40,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  titleView: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: cssVar('thm2')
  },
  flex: {
    flex: 1
  },
  white: {
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  button: {
    // width: 150
  },
  footer: {
    padding: 10,
    flexDirection: 'row'
  }
});

module.exports = Chat;
