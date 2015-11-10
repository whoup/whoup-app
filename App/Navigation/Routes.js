var Router = require("../Navigation/Router");

var Routes = {

  LogIn: function() {
    return {
      component: require('../Screens/LogIn'),
      title: 'Log in'
    };
  },

  SignUp: function() {
    return {
      component: require('../Screens/SignUp'),
      title: 'Sign Up'
    };
  },

  LogList: function(username) {
    return {
      component: require('../Screens/LogList'),
      title: '', // set to name
      passProps: {
        username: username
      },
      navRight: {
        subPath: '_post',
        icon: 'ios-create' // TODO: icon font
      },
      navLeft: {
        subPath: '_settings',
        icon: 'gear-a' // TODO: icon font
      },
    };
  },
  FriendAdd: function() {
    return{
      component: require('../Screens/FriendAdd'),
      title: 'Add Friend', // set to name
    };
  },

  FriendList: function(username) {
    return {
      component: require('../Screens/FriendList'),
      title: '', // set to name
      passProps: {
        username: username
      },
      navBack: {
        icon: 'close-round'
      },
      navRight: {
        subPath: '_friendAdd',
        icon: 'person-add' // TODO: icon font
      },
    };
  },
  Dashboard: function(username) {
    return {
      component: require('../Screens/Dashboard'),
      title: '',
      passProps: {
        username: username
      },
      navLeft: {
        subPath: 'friends',
        icon: 'plus-round' // TODO: icon font
      },
      navRight: {
        subPath: '_settings',
        icon: 'gear-a' // TODO: icon font
      },
    }
  },
  Settings: function() {
    return {
      component: require('../Screens/Settings'),
      title: 'Settings',
    };
  },

  CreateActivityLog: function() {
    return {
      component: require('../Screens/CreateFoodLog'),
      title: '',
      navBack: {
        icon: 'close-round'
      }
    };
  },
  CreateComment: function() {
    return {
      component: require('../Screens/CommentCreate'),
      title: 'New Comment',
      navBack: {
        icon: 'android-arrow-back'
      }
    };
  },

  NutritionRoom: function() {
    return {
      component: require('../Screens/NutritionRoom'),
      title: 'Nutrition Team',
      navBack: {
        mixIcon: {
          label: 'Messages',
          icon: 'ios-arrow-back'
        }
      }
    }
  },
  CookingRoom: function() {
    return {
      component: require('../Screens/CookingRoom'),
      title: 'Cooking Hotline',
      navBack: {
        mixIcon: {
          label: 'Messages',
          icon: 'ios-arrow-back'
        }
      }
    }
  },
  ActivityRoom: function() {
    return {
      component: require('../Screens/ActivityRoom'),
      title: 'Activity Team',
      navBack: {
        mixIcon: {
          label: 'Messages',
          icon: 'ios-arrow-back'
        }
      }
    }
  }


};


var listRoute = function(route, defaultRoute) {
  var username = route.passProps ? route.passProps.username : null;
  route.parse = function(path) {
    switch(path) {
      case 'friends':
        return listRoute(Routes.FriendList(username), null);
      case '_settings':
        return Routes.Settings();
      case '_friendAdd':
        return Routes.FriendAdd();
      case '_comments':
        return Routes.CreateComment();
      case '_nutrition':
      console.log('nutri');
        return Routes.NutritionRoom();
      case '_cooking':
      console.log('Cookin');
        return Routes.CookingRoom();
      case '_activity':
       console.log('Activity');
        return Routes.ActivityRoom();
      default:
        if (!defaultRoute) return null;
        return defaultRoute(path);
    }
  }
  return route;
};

var userRoute = function(username) {
  var route = {}
  route._notAddressable = true;
  route._routerAppend = 'dashboard';

  route.parse = function(path) {
    switch(path) {
      case 'logs':
        return listRoute(Routes.LogList(username), function(postId) {
          // TOOD: show log view?
          return null;
        });
      case '_friends':
        return listRoute(Routes.FriendList(username), null)
          // function(follow) {
          // // it's a user
          // return userRoute(follow);
        //})
      case 'dashboard':
        return listRoute(Routes.Dashboard(username), function(room) {
          // unsure
            return userRoute(room);
        });

      default:
        return null;
    };
  };
  return route;
};


var LoggedIn = {
  parse: function(host) {
    switch (host) {
      case 'dashboard':
        return userRoute(null);
      default:
        return null;
    }
  }
};

var LoggedOut = {
  parse: function(host) {
    switch (host) {
      case 'signup':
        return Routes.SignUp();
      case 'login':
        return Routes.LogIn();
      default:
        return null;
    }
  }
};

module.exports = {
  parse: function(str, loggedIn, defaulted, passProps) {
    var parent = loggedIn ? LoggedIn : LoggedOut;
    var found = Router.parse(str, parent, defaulted, passProps);
    if (!found && defaulted) {
      if (loggedIn) {
        found = this.parse('dashboard', true, false, passProps);
      }
      else {
        found = this.parse('signup', false, false, passProps);
      }
    }
    return found;
  }
};
