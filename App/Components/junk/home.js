/**
 * fwd App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TabBarIOS,
  NavigatorIOS,
  ListView
} = React;

var TabBarIOS = require('TabBarIOS');
var TabBarItemIOS = Icon.TabBarItem

var LogView = require('./log_view');
// var MessagesView = require('./js/messages_view');
// var DiscoverView = require('./js/discover_view');
// var ProfileView = requrie('./js/profile_view')

var Home = React.createClass({
  getInitialState: function () {
    return {
      selectedTab: 'log'
    }
  },

  render: function() {
    return (
      <TabBarIOS>
        <TabBarItemIOS
          iconName="ios-paper"
          selectedIconName="ios-paper"
          title = {'Log'}
          selected = {this.state.selectedTab === 'log'}
          onPress={ () => {
            this.setState({
              selectedTab: 'log',
            });
          }}>
          <NavigatorIOS
            barTintColor='#f1f1f1'
            titleTextColor='#d34836'
            translucent={true}
            initialRoute = {{
              component: LogView,
              title: 'Forward',
              passProps: { myProp: 'foo' }
            }}
            style = {styles.fullScreen}
          />
        </TabBarItemIOS>
        <TabBarItemIOS
          iconName="chatboxes"
          selectedIconName="chatboxes"
          title = {'Message'}
          selected = { this.state.selectedTab === 'message'}
          onPress = { () => {
            this.setState({
              selectedTab: 'message',
            });
          }}>
          <NavigatorIOS
            initialRoute = {{
              component: LogView,
              title: 'Message',
              passProps: { myProp: 'foo'},
            }}
            style = {styles.fullscreen}
          />
        </TabBarItemIOS>
        <TabBarItemIOS
          iconName="search"
          selectedIconName="search"
          title = 'Discover'
          selected = { this.state.selectedTab === 'discover'}
          onPress = { () => {
            this.setState({
              selectedTab: 'discover',
            });
          }}>
          <NavigatorIOS
            initialRoute = {{
              component: LogView,
              title: 'Discover',
              passProps: { myProp: 'foo'},
            }}
            style = {styles.fullscreen}
          />
        </TabBarItemIOS>
        <TabBarItemIOS
          iconName="person"
          selectedIconName="person"
          title = 'Profile'
          selected = { this.state.selectedTab === 'profile'}
          onPress = { () => {
            this.setState({
              selectedTab: 'profile',
            });
          }}>
          <NavigatorIOS
            initialRoute = {{
              component: LogView,
              title: 'Profile',
              passProps: { myProp: 'foo'},
            }}
            style = {styles.fullscreen}
          />
        </TabBarItemIOS>
      </TabBarIOS>);
  }
});

var styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  }
});

module.exports = Home;
