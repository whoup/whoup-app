// parent must implement getNavBarState()

var TimerMixin = require('react-timer-mixin');

var Dispatcher   = require('../Dispatcher');
var AppConstants = require('../Constants/AppConstants');

var NavBarHelper = {
  mixins: [TimerMixin],

  componentDidMount: function() {
    this.updateNavComponents();
  },

  componentDidUpdate: function() {
    this.updateNavComponents();
  },

  updateNavComponents: function() {
    var updates = this.getNavBarState();
    if (!updates) return;

    if(typeof updates.title !== "undefined") {
      this.props.currentRoute.title = updates.title;
    }
    if (typeof updates.navRightDisabled !== "undefined") {
      this.props.currentRoute.navRight.disabled = updates.navRightDisabled;
    }
    if (typeof updates.navRightIcon !== "undefined") {
      this.props.currentRoute.navRight.icon = updates.navRightIcon;
    }
    if (typeof updates.navColor !== "undefined") {
      this.props.currentRoute.navColor = updates.navColor;
    }

    // if called during componentDidLoad, nav bar not loaded yet
    // requestAnimationFrame to allow it to finish
    var route = this.props.currentRoute;
    this.requestAnimationFrame(function() {
      Dispatcher.dispatch({
        actionType: AppConstants.NAVBAR_UPDATE,
        route: route
      });
    });
  },
};

module.exports = NavBarHelper;
