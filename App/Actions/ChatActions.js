var Dispatcher    = require('../Dispatcher');
var AppConstants  = require('../Constants/AppConstants');
var ChatService = require('../Api/ChatService');
var amOnline = new Firebase('https://whoup.firebaseio.com/.info/connected');

var CurrentUserStore = require('../Stores/CurrentUserStore');
var CURRENT_USER = CurrentUserStore.get().data;

var ChatActions = {
  goOnline: function(uid, callback) {
    var userRef = new Firebase('https://whoup.firebaseio.com/presence/' + uid);
    amOnline.on('value', function(snapshot) {
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
        userRef.set(true);
      }
    });
  },
  fetchList: function(room_id, callback) {
    ChatService.fetchList(room_id, function(error, listProps) {
      if(callback) callback(error);

      if (!error) {
        Dispatcher.dispatch({
          actionType: AppConstants.CHAT_LIST_UPDATED,
          listProps: listProps
        });
      }
    });
  },
  createMessage: function(content, progressCallback, callback) {
    ChatService.createMessage(content, progressCallback, function(error, messageProps) {
      if(callback) callback(error);
      if (!error) {
        Dispatcher.dispatch({
          actionType: AppConstants.MESSAGE_ADDED,
          messageProps: messageProps
        });
      }
    });
  }
};

module.exports = ChatActions;
