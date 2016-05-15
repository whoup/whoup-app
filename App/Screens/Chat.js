var React = require('react-native');
var {
  View,
  StyleSheet,
  ActivityIndicatorIOS,
  InteractionManager,
  ProgressViewIOS,
  Image,
  InteractionManager
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

var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var FirebaseRef = require('../Api/FirebaseRef');

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
  // getListItems: function() {
  //   return ChatListStore.get(this.props.room_id);
  // },

  // isListChange: function(username) {

  //   // TODO: how to know if chatlist has changed??
  //   return this.getUsername() == username;
  // },

  getItemProps: function(message) {
    return {
      key: message.key,
      body: message.body,
      received: message.received,
      timestamp: message.timestamp,
      image: message.image
    }
  },

  // reloadList: function() {
  //   console.log("reloading Messages: " + this.props.room_id);
  //   // ChatActions.fetchList(this.props.room_id, function(error) {
  //   //   // TODO: handle error
  //   //   if (error) {
  //   //     alert(error.message);
  //   //   }
  //   // });
  // },

  getInitialState: function() {
    var state = this.getListState();
    state.renderPlaceHolder = false;
    return state
  },

  getListState: function() {
    return {
      messages: [],
      sending: false,
      progress: 1,
      working: false,
      renderPlaceHolder: true,
    };
  },

  toggleSending: function() {
    this.setState({sending: (!this.state.sending)})
  },

  updateProgress: function(e) {
    this.setState({progress: e})
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

  getMoreMessages: function() {
    //this.setState(this.getListState());
    if (!this.state.working){
      FirebaseRef.ref().child('users').child(this.getUserId()).child('messages').child(this.props.passProps.id)
      //.orderByChild('timestamp')
      .endAt(null, this.state.messages[0].key)
      .limitToLast(10)
      .once('value', function (snapshot) {
        var msgs = [];
        snapshot.forEach(function(data) {
          var d = data.val();
          d.key = data.key();
          if (d.key !== this.state.messages[0].key)
          msgs.push(d);
          //console.log("The " + data.key() + " dinosaur's score is " + data.val());
        }.bind(this));
        this.setState({messages: msgs.concat(this.state.messages), working: false})
      }.bind(this));
    }
    this.setState({working: true});
    // base.fetch(messages, {
    //   context: this,
    //   asArray: true,
    //   queries: {
    //     //orderByChild: 'timestamp',
    //     limitToLast: 3,

    //   }
    //   then(data){
    //     console.log(data);
    //   }
    // });
  },

  messageAdded: function() {
    //this.reloadList();
  },

  onDidFocusNavigation: function() {
    // items may have changed
    //this.setState(this.getListState());

  },

  componentDidMount: function() {
    InteractionManager.runAfterInteractions(() => {
      var messages = 'users/' + this.getUserId() + '/messages/' + this.props.passProps.id;
      this.messageRef = base.bindToState(messages, {
        context: this,
        state: 'messages',
        asArray: true,
        queries: {
          orderByChild: 'timestamp',
          //limitToLast: 10,

        }
      });
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
    return CurrentUserStore.get().data.username;
  },

  getUserId: function() {
    return CurrentUserStore.get().data.id
  },

  renderProgress: function() {
    if (this.state.progress < 1) {
      return (
        <ProgressViewIOS
          progress={this.state.progress}
          trackTintColor={cssVar('thm2')}
          progressViewStyle={'default'}
          progressTintColor={cssVar('thm1')}
        />
      );
    }
    else {
      return (
        <View/>
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
         items={[<ActivityIndicatorIOS color={'black'}/>]}
         {...this.props.listProps}
       />
      );
    }
    else {
      //onEndReached={this.getMoreMessages}
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
    var friendId = this.props.passProps == undefined ? null : this.props.passProps.id;
    return (
      <View style={[styles.flex, {backgroundColor: 'black'}]}>
        {title}
        <View style={[styles.flex, styles.white]} >
          {progress}
          {content}
        </View>
          <ChatInput toggleSubmitting={this.toggleSending} updateProgress={this.updateProgress}
            currUid={this.getUserId()} username={this.getUsername()} friendId={friendId} />

      </View>
    );
  },

  render: function() {
    //console.log(this.state);
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
