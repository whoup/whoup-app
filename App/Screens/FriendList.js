var React = require('react-native');

var ListHelper = require('../Mixins/ListHelper');

var FriendListStore = require('../Stores/FriendListStore');
var FriendActions   = require('../Actions/FriendActions');

var FollowList = React.createClass({
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
    return FriendListStore.get('request');
  },

  isListChange: function(username) {
    return this.getUsername() == username;
  },

  getItemProps: function(follow) {
    console.log(follow);
    return {
      key: follow.data.id,
      title: follow.data.username,
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



module.exports = FollowList;
