var Dispatcher    = require('../Dispatcher');
var AppConstants  = require('../Constants/AppConstants');
var ChatService = require('../Api/ChatService');

var ChatActions = {

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
