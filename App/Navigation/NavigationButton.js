var React  = require('react-native');
var {
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} = React;

var cssVar = require('../Lib/cssVar');

var DispatcherListener = require('../Mixins/DispatcherListener');
var AppConstants       = require('../Constants/AppConstants');
var AppActions         = require('../Actions/AppActions');

var Text = require('../Components/Text');
var Icon = require('react-native-vector-icons/Ionicons');

var NavigationButton = React.createClass({
  mixins: [DispatcherListener],

  getInitialState: function() {
    return {updatedRoute: null};
  },

  dispatchAction: function(action) {
    switch(action.actionType) {
      case AppConstants.NAVBAR_UPDATE:
        var route = this.state.updatedRoute || this.props.route;
        if (action.route.routePath === route.routePath) {
          this.setState({updatedRoute: action.route});
        }
        break;
    }
  },

  makeButton: function(item, style, callback) {
    var styleType;
    var comp;

    if (item.mixIcon) {
      comp = (
                <Icon name={item.mixIcon.icon} size={50} color={cssVar('thm3')} style={[styles[item.label + 'NavBar'], item.disabled && styles.disabledText]}>
                    <Text style={[styles.navBarText, styles.navBarIconText, styles.navBarButtonText, styles[item.mixIcon.label + 'NavBar'], item.disabled && styles.disabledText]}>
                      {item.mixIcon.label}
                    </Text>
                </Icon>
      )
    }
    else if (item.icon) {
      comp = (
              <Icon name={item.icon} size={40} color={cssVar('thm3')} style={[styles.navBarIcon, styles[item.label + 'NavBar'], item.disabled && styles.disabledText]} />
              )
    }
    else if (item.image) {
      if (item.image == "add_friend") {
        comp = <Image style={[styles.imageIcon]} source={require('../Images/add_friend.png')} />
      }
      else if (item.image === "settings") {
        comp = <Image style={[styles.imageIcon]} source={require('../Images/settings.png')} />
      }
       else {
        comp = <Image style={[styles.imageIcon]} source={require('../Images/owl_yellow.png')} />
      }
    }
    else {
      comp = (
              <Text style={[styles.navBarText, styles.navBarButtonText, styles[item.label + 'NavBar'], item.disabled && styles.disabledText]}>
                  {item.label}
              </Text>
        )
    }

    var button = (
      <View style={style}>
        {comp}
      </View>
    );

    if (item.disabled) {
      return button;
    }
    else {
      return (
        <TouchableOpacity style={[this.props.direction === 'left' && styles.leftButton]} onPress={callback}>
          {button}
        </TouchableOpacity>
      );
    }
  },

  renderRight: function() {
    var route = this.props.route || this.state.updatedRoute;
    if (!route.navRight) return null;

    return this.makeButton(route.navRight, styles.navBarRightButton, function() {
      AppActions.launchNavItem(route, route.navRight);
    });
  },

  renderLeft: function() {
    var route = this.props.route || this.state.updatedRoute;
    if (route.navLeft && !route.navBack) {
      return this.makeButton(route.navLeft, styles.navBarLeftButton, function() {
        AppActions.launchNavItem(route, route.navLeft);
      });
    }

    if (this.props.index === 0) {
      return null;
    }

    var backLabel = route.navBack || {icon: 'ios-arrow-back'}; //{icon: 'caret-left-semi'};
    return this.makeButton(backLabel, styles.navBarLeftButton, this.goBack);
  },

  goBack: function() {
    AppActions.goBack(this.props.navigator);
  },

  render: function() {
    switch (this.props.direction) {
      case 'left':
        return this.renderLeft();
      case 'right':
        return this.renderRight();
      default:
        throw("Unknown direction: " + this.props.direction);
    }
  }
});

var styles = StyleSheet.create({
  navBarText: {
    fontSize: 18,
    marginVertical: 8,
  },
  navBarIconText: {
    marginLeft: 5,
    justifyContent: 'center'
  },
  navBarIcon: {
    marginVertical: 8,
  },
  navBarLeftButton: {
    paddingLeft: 15,
  },
  navBarRightButton: {
    paddingRight: 15,
  },
  navBarButtonText: {
    color: cssVar('thm2'),
  },
  disabledText: {
    color: cssVar('gray30')
  },
  leftButton: {
    paddingRight: 50,
  },
  imageIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent'
  },
});

module.exports = NavigationButton;
