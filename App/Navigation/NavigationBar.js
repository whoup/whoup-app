var React = require('react-native');
var {
  Navigator,
  StyleSheet,
  TouchableOpacity,
  View,
  Image
} = React;

var cssVar = require('../Lib/cssVar');

//var NavigatorNavigationBarStyles = require('NavigatorNavigationBarStyles');
var NavigationBarRouteMapper     = require('../Navigation/NavigationBarRouteMapper');
var NavBarStylesIOS = require('../Navigation/NavBarStylesIOS');
var DispatcherListener = require('../Mixins/DispatcherListener');
var AppConstants = require('../Constants/AppConstants');


var stacksEqual = function(one, two, length) {
  if (one.length < length) return false;
  if (two.length < length) return false;

  for (var i=0; i < length; i++) {
    if (one[i].routePath !== two[i].routePath) {
      return false;
    }
  }
  return true;
};

var SCREEN_WIDTH = require('Dimensions').get('window').width;
var RightBaseConfig = Navigator.SceneConfigs.FloatFromLeft;
var LeftBaseConfig = Navigator.SceneConfigs.FloatFromRight;

var CustomRightToLeftGesture = Object.assign({}, RightBaseConfig.gestures.pop, {
  // Make it snap back really quickly after canceling pop
  snapVelocity: 1,

  direction: 'right-to-left',
  // Make it so we can drag anywhere on the screen
  edgeHitWidth: SCREEN_WIDTH,
});

var RightSceneConfig = Object.assign({}, RightBaseConfig, {
  // A very tightly wound spring will make this transition fast

  // Use our custom gesture defined above
  gestures: {
    pop: CustomRightToLeftGesture,
  }
});

var CustomLeftToRightGesture = Object.assign({}, LeftBaseConfig.gestures.pop, {
  // Make it snap back really quickly after canceling pop
  snapVelocity: 1,
  direction: 'left-to-right',
  // Make it so we can drag anywhere on the screen
  edgeHitWidth: SCREEN_WIDTH,
});

var LeftSceneConfig = Object.assign({}, LeftBaseConfig, {
  // A very tightly wound spring will make this transition fast

  // Use our custom gesture defined above
  gestures: {
    pop: CustomLeftToRightGesture,
  }
});

var Container = React.createClass({
  render: function() {
    var statBar;
    if (this.props.navBarHidden) {
      statBar =  (<View style={styles.navBarSmall}/>);
    }
    var Component = this.props.route.component;

    return (
      <View
        style={[styles.scene, this.props.navBarHidden && styles.sceneHidden]}
        ref={this.props.onLoadedScene}
      >

        <Component ref="mainComponent"
          navigator={this.props.navigator}
          currentRoute={this.props.route}
          passProps={this.props.routeStack.passProps}
          {...this.props.route.passProps}
        />
      </View>
    );
  }
});

class NavBar extends Navigator.NavigationBar {
  render() {
    var routes = this.props.navState.routeStack;;

    if (routes.length) {
      var route = routes[routes.length - 1];

      if (route.display === false) {
        return null;
      }
    }

    return super.render();
  }
}

var NavigationBar = {

  renderScene: function(route, navigator) {
    console.log('renderScene: ' + route.routePath);
    return(
      <Container
        ref={this.onLoadedScene}
        route={route}
        navigator={navigator}
        {...this.props}
      />
    );
  },

  onLoadedScene: function(component) {
    console.log("onLoadedScene");
    if (component) {
      this._currentComponent = component.refs.mainComponent;
    }
    else {
      this._currentComponent = null;
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    var current = this.refs.navigator.getCurrentRoutes();

    if (!current) return; // otherwise initial

    var next = this.props.routeStack.path;
    var currentRoute = current[current.length - 1];
    var currentPath  = currentRoute.routePath;
    var nextRoute    = next[next.length - 1];
    var nextPath     = nextRoute.routePath;

    if(stacksEqual(current, next, current.length)
          && next[next.length-2]
          && next[next.length-2].routePath === currentPath) {
      // simple push
      this.refs.navigator.push(nextRoute);
    }
    else if(stacksEqual(current, next, next.length)
          && current[current.length-2]
          && current[current.length-2].routePath === nextPath) {
      // simple pop
      this.refs.navigator.pop();
    }
    else if(stacksEqual(current, next, next.length-1)) {
      // switching out last one
      if (currentRoute.component === nextRoute.component
          && this._currentComponent
          && this._currentComponent.setNavigatorRoute) {
        // switch out current one, same type
        if (this._currentComponent.props.currentRoute) {
          // update it in place
          this._currentComponent.props.currentRoute = currentRoute;
        }
        this._currentComponent.setNavigatorRoute(nextRoute);
      }
      else {
        this.refs.navigator.replace(nextRoute);
      }
    }
    else {
      // something more complicated
      this.refs.navigator.immediatelyResetRouteStack(this.props.routeStack.path);
    }
  },

  _configureScene: function(route) {
    if (route.left)
      return LeftSceneConfig;
    else {
      return RightSceneConfig;
    }
  },

  // renderYellowNavBar: function() {
  //   return (
  //       <Navigator.NavigationBar
  //         navigationStyles={NavBarStylesIOS}
  //         routeMapper={new NavigationBarRouteMapper()}
  //         style={[styles.navBarYellow]}
  //       />
  //     );
  // },
  renderNavBar: function() {
      return (
        <NavBar
          navigationStyles={NavBarStylesIOS}
          routeMapper={new NavigationBarRouteMapper()}
          style={[styles.navBar]}
        />);
  },
  render: function() {
    var paths = this.props.routeStack.path;
    var path = paths[paths.length-1];
    return (
        <Navigator
          ref="navigator"
          debugOverlay={false}
          renderScene={this.renderScene}
          navBarHidden={this.state.navbarHidden}
          initialRouteStack={this.props.routeStack.path}
          navigationBar={this.renderNavBar()}
          configureScene={this._configureScene}
        />
    );
  }
}

var styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
  navBarYellow: {
    backgroundColor: 'transparent'//cssVar('thm1')
  },
  navBar: {
    height: 64,//NavigatorNavigationBarStyles.General.TotalNavHeight
    justifyContent: 'center'
  },
  navBarColor: {
    backgroundColor: 'transparent',
    height: 64//NavigatorNavigationBarStyles.General.TotalNavHeight
  },
  navBarSmall: {
    backgroundColor: 'white',
    height: 20,
  },
  scene: {
    flex: 1,
    marginTop: 0,//NavigatorNavigationBarStyles.General.TotalNavHeight,
    backgroundColor: 'transparent',
  },
  sceneHidden: {
    marginTop: 0
  }
});


module.exports = NavigationBar;
