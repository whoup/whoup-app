var React = require('react-native');
var {
  View,
  StyleSheet,
  Image
} = React;


var ListHelper = require('../Mixins/ListHelper');
var cssVar = require('../Lib/cssVar');
var Text       = require('../Components/Text');
var FriendListStore = require('../Stores/FriendListStore');
var FriendRequestStore = require('../Stores/FriendRequestStore');
var FriendActions   = require('../Actions/FriendActions');


var Loading          = require('../Screens/Loading');
var Text             = require('../Components/Text');
var SimpleList       = require('../Components/SimpleList');


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
    return { users: [] }
  },

  componentDidMount: function(){
    this.ref = base.bindToState('users/' + CURRENT_USER.id + '/friends', {
      context: this,
      state: 'users',
      asArray: true
    });
  },
  componentWillUnmount: function(){
    base.removeBinding(this.ref);
  },

  renderEmpty: function() {
    return(
      <View/>
    );
  },

  getItemProps: function(friend) {
    return {
      key: friend.key,
      type: 'friend',
      up: false,
      id: friend.key,
      name: friend.username,
    }
  },

  renderItems: function() {
    return (
      <SimpleList
        style={styles.flex}
        currentRoute={this.props.currentRoute}
        getItemProps={this.getItemProps}
        items={this.state.users}
        {...this.props.listProps}
      />
    );
  },


   renderContent: function() {
    var content;
    var empty;
    if (this.state.users.length === 0) {
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

  renderList: function() {
    if (this.state.users === null) {
      return (<View/>
              );
    }
    else if (this.state.users === undefined) {
      return <Loading />;
    }
    else {
      return this.renderContent();
    }
  },

  render: function() {
    return this.renderList();
  }
});



// var RequestList = React.createClass({
//   mixins: [ListHelper],

//   getDefaultProps: function() {
//     return {
//       navBarTitle: '',
//       listProps: {
//         nextIcon: true
//       },
//     };
//   },

//   getListItems: function() {
//     uid = this.getUserId();
//     return FriendRequestStore.get('request');
//   },

//   isListChange: function(username) {
//     return this.getUsername() == username;
//   },

//   blankContent: function() {
//     return(
//       <View/>
//     );
//   },

//   // watchData: function() {
//   //  return FriendActions.mountFriendReq();
//   // },
//   // unwatchData: function() {
//   //   return FriendActions.unmountFriendReq();
//   // },

//   getItemProps: function(friend) {
//     return {
//       key: friend.data.id,
//       type: 'request',
//       action: 'accept',
//       id: friend.data.id,
//       title: friend.data.username,
//       reloadList: this.reloadList
//     }
//   },

//   // reloadList: function() {
//   //   console.log("reloading follows: " + this.getUserId());
//   //   this.setTimeout( () => {
//   //     FriendActions.fetchRequestList(this.getUserId(), function(error) {
//   //       // TODO: handle error
//   //       if (error) {
//   //         alert(error.message);
//   //       }
//   //     });
//   //   },1000);
//   // },

//   render: function() {
//     return this.renderList();
//   }
// });


var FriendAndRequestList = React.createClass({

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
        <View style={styles.navBar} />
        <View style={[styles.container, noReqs && styles.qflex]}>

        </View>
        <View style={styles.spacer}/>
        <View style={[styles.container, styles.flex]}>
          <FriendList store={FriendListStore} {...this.props} />
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
  },
  paddTop: {
    marginTop: 20
  },
  qflex: {
    flex: 0.20
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
