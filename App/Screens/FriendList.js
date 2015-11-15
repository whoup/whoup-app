var React = require('react-native');
var {
  View,
  StyleSheet
} = React;


var ListHelper = require('../Mixins/ListHelper');
var cssVar = require('../Lib/cssVar');
var Text       = require('../Components/Text');
var FriendListStore = require('../Stores/FriendListStore');
var FriendRequestStore = require('../Stores/FriendRequestStore');
var FriendActions   = require('../Actions/FriendActions');

var FriendList = React.createClass({
  mixins: [ListHelper],

  getDefaultProps: function() {
    return {
      navBarTitle: 'My Friends',
      listProps: {
        nextIcon: true
      },
    };
  },

  // watchData: function() {
  //  return FriendActions.mountFriendAdd();
  // },
  // unwatchData: function() {
  //   return FriendActions.unmountFriendAdd();
  // },

  getListItems: function() {
    uid = this.getUserId();
    return FriendListStore.get('friend');
  },

  isListChange: function(username) {
    return this.getUsername() == username;
  },

  blankContent: function() {
    return(
      <View/>
    );
  },

  getItemProps: function(friend) {
    return {
      key: friend.data.id,
      type: 'friend',
      action: 'accept',
      id: friend.data.id,
      title: friend.data.username,
    }
  },

  reloadList: function() {
    console.log("reloading follows: " + this.getUserId());
    FriendActions.fetchList(this.getUserId(), function(error) {
      // TODO: handle error
      if (error) {
        alert(error.message);
      }
    });
  },

  render: function() {
    return this.renderList();
  }
});



var RequestList = React.createClass({
  mixins: [ListHelper],

  getDefaultProps: function() {
    return {
      listProps: {
        nextIcon: true
      },
    };
  },

  getListItems: function() {
    uid = this.getUserId();
    return FriendRequestStore.get('request');
  },

  isListChange: function(username) {
    return this.getUsername() == username;
  },

  blankContent: function() {
    return(
      <View/>
    );
  },

  // watchData: function() {
  //  return FriendActions.mountFriendReq();
  // },
  // unwatchData: function() {
  //   return FriendActions.unmountFriendReq();
  // },

  getItemProps: function(friend) {
    return {
      key: friend.data.id,
      type: 'request',
      action: 'accept',
      id: friend.data.id,
      title: friend.data.username,
      reloadList: this.reloadList
    }
  },

  reloadList: function() {
    console.log("reloading follows: " + this.getUserId());
    FriendActions.fetchRequestList(this.getUserId(), function(error) {
      // TODO: handle error
      if (error) {
        alert(error.message);
      }
    });
  },

  render: function() {
    return this.renderList();
  }
});


var FriendAndRequestList = React.createClass({

  render: function() {
    var reqList;
    var reqStore = FriendRequestStore;
    var anyRequests = reqStore.get('request');
    var anyFriends = reqStore.get('friend');
    if (anyRequests === null || anyRequests === 'undefined') {
      reqList = <RequestList store={reqStore} {...this.props} />
    }
    else {
      reqList = <RequestList store={reqStore} {...this.props} />
    }

    return (
      <View style={[styles.flex, styles.container]}>
        <Text style={[styles.section]}>requests</Text>
        <View style={[styles.container, anyRequests && styles.qflex]}>
          {reqList}
        </View>
        <View style={styles.spacer}/>
        <Text style={[styles.section]}>all friends</Text>
        <View style={[styles.container, anyRequests && styles.flex]}>
          <FriendList store={FriendListStore} {...this.props} />
        </View>
      </View>
            );
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  qflex: {
    flex: 0.20
  },
  container: {
    backgroundColor: cssVar('thm5')
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
