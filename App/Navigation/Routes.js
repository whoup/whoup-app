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
      navRight: {
        subPath: '_friendAdd',
        icon:   'ios-plus-outline'//'ios-personadd' // TODO: icon font
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
        icon: 'ios-people' // TODO: icon font
      },
      navRight: {
        subPath: '_settings',
        icon: 'ios-gear' // TODO: icon font
      },
    }
  },
  Settings: function() {
    return {
      component: require('../Screens/Settings'),
      title: 'Settings',
    };
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
