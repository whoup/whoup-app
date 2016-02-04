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
var dismissKeyboard = require('dismissKeyboard');

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

    if (item.disabled) {
      comp = <Image style={styles.imageIcon}/>
    }
    else if (item.mixIcon) {
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
              <Icon name={item.icon} size={30} color={cssVar('thm3')} style={[styles.navBarIcon, styles[item.label + 'NavBar'], item.disabled && styles.disabledText]} />
              )
    }
    else if (item.image) {
      comp = <Image style={[styles.imageIcon]} source={{uri: item.image}} />
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
      return(
        <TouchableOpacity style={[this.props.direction === 'left' && styles.leftButton]} onPress={callback}>
          {button}
        </TouchableOpacity>
      );
    }
  },

  renderRight: function() {

    var route = this.props.route || this.state.updatedRoute;
    //if (!route.navRight) return null;
    if (route.navRight && !route.navBack) {
      return this.makeButton(route.navRight, styles.navBarRightButton, function() {
        AppActions.launchNavItem(route, route.navRight);
      });
    }

    if (this.props.index === 0) {
      return null;
    }
    if (route.left == undefined) {
      var backLabel = route.navBack || {icon: 'ios-arrow-left'}; //{icon: 'caret-left-semi'};
      return this.makeButton(backLabel, styles.navBarRightButton, this.goBack);
    } else {
      return null;
    }
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
    if (route.left) {
      var backLabel = route.navBack || {icon: 'ios-arrow-left'}; //{icon: 'caret-left-semi'};
      return this.makeButton(backLabel, styles.navBarLeftButton, this.goBack);
    } else {
      return null;
    }
  },

  goBack: function() {
    dismissKeyboard();
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
    opacity: 0.9,
    marginVertical: 8,
    //color: cssVar('thm2'),
  },
  navBarLeftButton: {
    marginLeft: 18,
  },
  navBarRightButton: {
    marginRight: 18,
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
    width: 30,
    height: 30,
    marginTop: 5,
    backgroundColor: 'transparent'
  },
});

module.exports = NavigationButton;
