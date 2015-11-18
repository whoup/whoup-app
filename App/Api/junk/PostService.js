var client = require('../Api/HTTPClient')
var CurrentUserStore = require('../Stores/CurrentUserStore');

var PostService = {
  parseFoodLog: function(response) {
    if (!response) return null;

    return {
      id: response.id,
      type_of_log: response.type_of_log,
      user_id: response.user_id,
      time: response.time,
      description: response.description,
      heart: response.heart,
      image: response.image,
      created_at: response.created_at,
      updated_at: response.updated_at,

      comments: response.comments

    };
  },
  parseActivityLog: function(response) {
    if (!response) return null;

    return {
      id: response.id,
      type_of_log: response.type_of_log,
      user_id: response.user_id,
      time: response.time,
      name: response.name,
      intensity: response.intensity,
      notes: response.notes,
      heart: response.heart,
      created_at: response.created_at,
      updated_at: response.updated_at,

      comments: response.comments,

    };
  },

  parseLogs: function(response, username) {
    if (!response) return null;

    var out = {posts: []};
    for(var i in response) {
      var paresed_post;
      if (response[i].type_of_log == 'activity')
        parsed_post = PostService.parseActivityLog(response[i]);
      else if (response[i].type_of_log == 'food')
        parsed_post = PostService.parseFoodLog(response[i]);

      out.posts.push(parsed_post);
    }
    out.username = username;
    return out;
  },

  fetchList: function(username, callback) {
    client.get("logs", {}, function(error, response) {
      var listProps = PostService.parseLogs(response, username);
      callback(error, listProps);
    });
  },

  createFoodLog: function(data, progressCallback, callback) {
    client.postFormData("food_logs", data, progressCallback, function(error, response) {
      var postProps = PostService.parseFoodLog(response.food_log);
      postProps.username = CurrentUserStore.get().data.username;
      callback(error, postProps);
    });
  },
  createActivityLog: function(content, callback) {
    client.post("activity_logs", content, function(error, response) {
      var postProps = PostService.parseActivityLog(response.activity_log);
      postProps.username = CurrentUserStore.get().data.username;
      callback(error, postProps);
    });
  },
  createLogComment: function(data, progressCallback, callback) {
    var logType = (data.type === 'activity') ? 'activity_logs' : 'food_logs';
    client.post((logType + '/' + data.logId + '/comments'), data.params, function(error, response) {
      var postProps = PostService.parseActivityLog(response);
      postProps.username = CurrentUserStore.get().data.username;
      callback(error, postProps);
    });
  },

};

module.exports = PostService;
