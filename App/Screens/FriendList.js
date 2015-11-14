var React = require('react-native');
var {
  View
} = React;


var ListHelper = require('../Mixins/ListHelper');

var FriendListStore = require('../Stores/FriendListStore');
var FriendActions   = require('../Actions/FriendActions');

var FriendList = React.createClass({
  mixins: [ListHelper],

  getDefaultProps: function() {
    return {
      store: FriendListStore,
      navBarTitle: 'Friends',
      listProps: {
        nextIcon: true
      },
    };
  },

  getListItems: function() {
    uid = this.getUserId();
    return FriendListStore.get('friend');
  },

  isListChange: function(username) {
    return this.getUsername() == username;
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
      store: FriendListStore,
      listProps: {
        nextIcon: true
      },
    };
  },

  getListItems: function() {
    uid = this.getUserId();
    return FriendListStore.get('request');
  },

  isListChange: function(username) {
    return this.getUsername() == username;
  },

  getItemProps: function(friend) {
    return {
      key: friend.data.id,
      type: 'request',
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


var FriendAndRequestList = React.createClass({
  render: function() {
    return (
            <View>
      <RequestList {...this.props} />
      <FriendList {...this.props} />
      </View>
            );
  }
});


module.exports = FriendAndRequestList;
