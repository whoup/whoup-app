var React = require('react-native');

var ChatHelper = require('../Mixins/ChatHelper');

var ChatListStore = require('../Stores/ChatListStore');
var ChatActions   = require('../Actions/ChatActions');


var ChatList = React.createClass({
  mixins: [ChatHelper],

  getDefaultProps: function() {

    return {
      store: ChatListStore,
      room_id: 2,
      navBarTitle: 'Cooking Hotline',
      listProps: {
        noTap: true
      }
    };
  },
  getListItems: function() {

    return ChatListStore.get(this.props.room_id);
  },

  isListChange: function(username) {

    // TODO: how to know if chatlist has changed??
    return this.getUsername() == username;
  },

  getItemProps: function(message) {
    return {
      key: message.data.id,
      title: message.data.body,

    }
  },

  reloadList: function() {
    console.log("reloading Messages: " + this.props.room_id);
    ChatActions.fetchList(this.props.room_id, function(error) {
      // TODO: handle error
      if (error) {
        alert(error.message);
      }
    });
  }
});



module.exports = ChatList;
