var Router = require("../Navigation/Router");

var Routes = {

  LogIn: function() {
    return {
      component: require('../Screens/LogIn'),
      statBar: 'light-content'
    };
  },

  Welcome: function() {
    return {
      component: require('../Screens/Welcome'),
      subPath: 'login',
      statBar: 'light-content'
    };
  },

  SignUp: function() {
    return {
      component: require('../Screens/SignUp'),
      statBar: 'light-content',
    };
  },

  FriendAdd: function() {
    return{
      component: require('../Screens/FriendAdd'),
      left: true,
      statBar: 'light-content'
    };
  },

  FriendList: function() {
    return {
      component: require('../Screens/FriendList'),
      title: '', // set to name
      statBar: 'light-content',
      display: false,
      navBack: {
        image:   '',//'ios-personadd' // TODO: icon font
      },
    };
  },
  Dashboard: function(username) {
    //console.log(username);
    var now = new Date();
    var sixAm = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          24,0,0);
    var itsTime = now < sixAm;
    var leftImage = itsTime ? 'owl_plus' : 'owl_plus_b';
    var rightImage = itsTime ? 'settings' : 'settings_b';
    var statBar = itsTime ? 'light-content' : 'default';
    return {
      component: require('../Screens/Dashboard'),
      title: '',
      statBar: statBar,
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
      statBar: 'default'
    };
  },


  Chat: function(username) {
    return {
      component: require('../Screens/Chat'),
      left: true,
      statBar: 'light-content',
      passProps: username
    }
  }


};


var listRoute = function(route, defaultRoute) {

  route.parse = function(path) {
    switch(path) {
      case 'friends':
        return listRoute(Routes.FriendList());
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

// var chatRoute = function(username) {
//   var route = {}
//   route._notAddressable = true;
//   route._routerAppend = '_chat';

//   route.parse = function(path) {
//     switch(path) {
//       case 'dashboard':
//         return listRoute(Routes.chat(username), function(user) {
//         });
//       default:
//         return null;
//     };
//   };
//   return route;
// };

var userRoute = function(username) {
  var route = {}
  route._notAddressable = true;
  route._routerAppend = 'dashboard';

  route.parse = function(path) {
    switch(path) {
      case 'dashboard':
        return listRoute(Routes.Dashboard(username), function(user) {
          console.log(user);
          return Routes.Chat(username);
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
      case 'whoup':
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
        found = this.parse('whoup', true, false, passProps);
      }
      else {
        found = this.parse('welcome', false, false, passProps);
      }
    }
    return found;
  }
};
