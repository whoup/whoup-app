// https://github.com/ide/react-native-button

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  View,
  ScrollView
} = React;

var cssVar     = require('../Lib/cssVar');
var Text       = require('../Components/Text');
var AppActions = require('../Actions/AppActions');
var TabBarIOS = require('TabBarIOS');
var Icon = require('react-native-vector-icons/Ionicons');
var TabBarItemIOS = Icon.TabBarItem;

var TabbedControl = React.createClass({

  tabComponents: function() {
    var out = [];
    for(var i = 0; i < this.props.items.length; i++) {
      var item = this.props.items[i];
      out.push(
        <TabItem {...item} key={"item" + i} currentRoute={this.props.currentRoute} content={this.props.content}/>
      );
    };
    return out;
  },

  render: function() {
    return (
      <TabBarIOS barTintColor={'black'}>
        {this.tabComponents()}
      </TabBarIOS>
    );
  }
});

var TabItem = React.createClass({

  onSelection: function() {
    AppActions.launchNavItem(this.props.currentRoute, this.props);
  },

  render: function() {
    return (
      <TabBarItemIOS
        iconName= {this.props.icon}
        selectedIconName={this.props.icon}
        title = {this.props.title}
        selected = {this.props.selected}
        onPress={this.onSelection}
      >
      {this.props.content}
      </TabBarItemIOS>
    );
  }
});


var styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',//cssVar('blue50'),
    padding: 10
  },
  control: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 4
  },
  flex: {
    flex: 1
  },
  button: {
    padding: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'white',
  },
  linkButton: {
    backgroundColor: cssVar('blue50'),
  },
  text: {
    fontSize: 16
  },
  selectedText: {
    color: cssVar('blue50'),
  },
  linkText: {
    color: 'white'
  }
});

module.exports = TabbedControl;
