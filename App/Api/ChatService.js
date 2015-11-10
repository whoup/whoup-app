var client = require('../Api/HTTPClient')

var ChatService = {
  parseMessage: function(response) {
    if (!response) return null;

    return {
      id: response.id,
      room_id: response.room_id,
      user: response.user,
      teammember: response.teammember,
      body: response.body,
      read: response.read,
      answered: response.answered,

      created_at: response.created_at,
      updated_at: response.updated_at
    };
  },

  parseMessages: function(response, room_id) {
    if (!response) return null;

    var out = {messages: []};
    for(var i in response) {
      out.messages.push(ChatService.parseMessage(response[i]));
    }
    out.room_id = room_id;
    return out;
  },

  roomIdToName: function(room_id) {
    var rooms = {
      1: 'nutrition',
      2: 'cooking',
      3: 'activity'
    };

    return rooms[room_id];
  },

  fetchList: function(room_id, callback) {
    client.get("chat/" + this.roomIdToName(room_id), {}, function(error, response) {
      var listProps = ChatService.parseMessages(response, room_id);
      callback(error, listProps);
    });
  },

  createMessage: function(data, progressCallback, callback) {

    client.postFormData("chat/" + this.roomIdToName(data.room_id), data.params, progressCallback, function(error, response) {
      var messageProps = ChatService.parseMessage(response.chat_message);
      console.log(response);
      callback(error, messageProps);
    });
  },
};

module.exports = ChatService;
