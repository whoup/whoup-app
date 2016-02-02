var Router = require("../Navigation/Router");

var Routes = {

  LogIn: function() {
    return {
      component: require('../Screens/LogIn'),
    };
  },

  Welcome: function() {
    return {
      component: require('../Screens/Welcome'),
      subPath: 'login'
    };
  },

  SignUp: function() {
    return {
      component: require('../Screens/SignUp'),
    };
  },

  FriendAdd: function() {
    return{
      component: require('../Screens/FriendAdd'),
      left: true
    };
  },

  FriendList: function(username) {
    return {
      component: require('../Screens/FriendList'),
      title: '', // set to name
      background: 'yellow',
      passProps: {
        username: username,
      },
      navBack: {
        image:   'owl_b'//'ios-personadd' // TODO: icon font
      },
    };
  },
  Dashboard: function(username) {
    var d0 = new Date("01/01/2001 " + "12:00 PM");
    var d1 = new Date("01/01/2001 " + "6:00 AM");
    var d = new Date("01/01/2001");
    d.setHours(new Date().getHours());
    d.setMinutes(new Date().getMinutes());
    var itsTime = d0 < d1  ? (d0 <= d && d < d1) : (d1 <= d && d < d0) == false;
    var leftImage = itsTime == true ? 'owl_plus' : 'owl_plus_b';
    var rightImage = itsTime ==true ? 'settings' : 'settings_b';
    return {
      component: require('../Screens/Dashboard'),
      title: '',
      passProps: {
        itsTime: itsTime,
      },
      navLeft: {
        subPath: 'friends',
        image: leftImage
      },
      navRight: {
        subPath: '_settings',
        image: rightImage // TODO: icon font
      },
    }
  },
  Settings: function() {
    return {
      component: require('../Screens/Settings'),
      title: 'Settings',
      left: true,
      navBack: {
        image:   'owl_b'//'ios-personadd' // TODO: icon font
      },
    };
  },


  Chat: function() {
    return {
      component: require('../Screens/Chat'),
      left: true,
    }
  }


};


var listRoute = function(route, defaultRoute) {

  var username = route.passProps ? route.passProps.username : null;
  route.parse = function(path) {
    switch(path) {
      case 'friends':
        return listRoute(Routes.FriendList(username));
      case '_chat':
        return Routes.Chat();
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
            return null
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
      case 'welcome':
        return Routes.Welcome();
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
        found = this.parse('welcome', false, false, passProps);
      }
    }
    return found;
  }
};
