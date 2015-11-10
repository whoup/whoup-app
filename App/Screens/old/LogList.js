var React = require('react-native');

var ListHelper = require('../Mixins/ListHelper');

var PostListStore = require('../Stores/PostListStore');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var PostActions   = require('../Actions/PostActions');


var LogList = React.createClass({
  mixins: [ListHelper],

  getDefaultWeek: function() {
    var date = new Date();
    var today = date.getDay();

    return {
        items: [
          {
            title: 'Sun',
            selected: today === 0
          },
          {
            title: 'Mon',
            selected: today === 1
          },
          {
            title: 'Tue',
            selected: today === 2
          },
          {
            title: 'Wed',
            selected: today === 3
          },
          {
            title: 'Thu',
            selected: today === 4
          },
          {
            title: 'Fri',
            selected: today === 5
          },
          {
            title: 'Sat',
            selected: today === 6
          }
        ],
        day: today
    }

  },

  getDefaultProps: function() {

    return {
      store: PostListStore,
      //navBarHidden: true,
      listProps: {
        noTap: true
      },
      tabItem: {
        items: [
          {
            title: 'Logs',
            replacePath: 'logs',
            selected: true,
            icon: 'ios-paper'
          },
          {
            title: 'Messages',
            replacePath: 'chatRoomList',
            icon: 'chatboxes'
          }

        ]
      },
    };
  },

updateDay: function(day) {

  var day = this.getDayNumber(day);
    this.setState({
      week: {
        items: [
          {
            title: 'Sun',
            selected: day === 0
          },
          {
            title: 'Mon',
            selected: day === 1
          },
          {
            title: 'Tue',
            selected: day === 2
          },
          {
            title: 'Wed',
            selected: day === 3
          },
          {
            title: 'Thu',
            selected: day === 4
          },
          {
            title: 'Fri',
            selected: day === 5
          },
          {
            title: 'Sat',
            selected: day === 6
          }
        ],
        day: day
      }
    });
  },

  getDayNumber: function(day) {
    var weekdays = {
      "Sun": 0,
      "Mon": 1,
      "Tue": 2,
      "Wed": 3,
      "Thu": 4,
      "Fri": 5,
      "Sat": 6
    };
  return weekdays[day];
  },

  getListDay: function() {
    var wkitems = this.state.week.items;
      for (var i in wkitems){
        if (wkitems[i].selected) return wkitems[i].title;
    }
  },

  getListItems: function() {
    return PostListStore.get(this.getUsername());
  },

  isListChange: function(username) {
    return this.getUsername() == username;
  },

  foodItemProps: function(log) {
    var current_user = CurrentUserStore.get().data;
    var firstComment = {
      key: 1,
      user_id: current_user.id,
      username: current_user.username,
      text: log.data.description,
      updated_at: log.data.updated_at,
    }

    var listComments = [firstComment].concat(log.data.comments);
    return {
      key: log.data.id,
      type: log.data.type_of_log,
      time: log.data.time,
      heart: log.data.heart,
      image: log.data.image,
      description: log.data.description,
      comments: log.data.comments,

      subPath: '_comments',
      passProps: {
        comments: listComments,
        log_id: log.data.id,
        type: log.data.type
      }
    }
  },
  activityItemProps: function(log) {
    var current_user = CurrentUserStore.get().data;

    var firstComment = {
      key: 1,
      user_id: current_user.id,
      username: current_user.username,
      text: log.data.notes,
      updated_at: log.data.updated_at,
    }
    var listComments = [firstComment].concat(log.data.comments);
    return {
      key: log.data.id,
      type: log.data.type_of_log,
      time: log.data.time,
      description: log.data.notes,
      heart: log.data.heart,
      name: log.data.name,
      intensity: log.data.intensity,
      comments: log.data.comments,

      subPath: '_comments',
      passProps: {
        comments: listComments,
        log_id: log.data.id,
        type: log.data.type_of_log
      }
    }
  },

  getItemProps: function(log) {
    if (log.data.type_of_log == 'activity')
      return this.activityItemProps(log);
    else if (log.data.type_of_log == 'food')
      return this.foodItemProps(log);
  },

  reloadList: function() {
    console.log("reloading posts: " + this.getUsername());
    PostActions.fetchList(this.getUsername(), function(error) {
      // TODO: handle error
      if (error) {
        alert(error.message);
      }
    });
  }
});



module.exports = LogList;
