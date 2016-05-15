var React = require('react-native');

var CommentHelper = require('../Mixins/CommentHelper');

var ChatListStore = require('../Stores/ChatListStore');
var ChatActions   = require('../Actions/ChatActions');


var ChatList = React.createClass({
  mixins: [CommentHelper],

  getDefaultProps: function() {

    return {
      navBarTitle: 'Create Comment',
      listProps: {
        noTap: true
      }
    };
  },
  getListItems: function() {
    return {...this.props.passProps.comments}
  },

  isListChange: function(username) {
    return this.getUsername() == username;
  },

  getItemProps: function(comment) {
    if (comment === undefined) return null;
    console.log(comment);
    return {
      key: comment.id,
      user_id: comment.user_id,
      username: comment.username,
      text: comment.text,
      updated_at: comment.updated_at,
      created_at: comment.created_at
    }
  },
});



module.exports = ChatList;
