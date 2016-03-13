var React  = require('react-native');
var {
  View,
  StyleSheet
} = React;

var SimpleListItem   = require('../Components/SimpleList');
var AppConstants = require('../Constants/AppConstants');
var cssVar = require('../Lib/cssVar');
var Text = require('../Components/Text');
var CurrentUserStore = require('../Stores/CurrentUserStore');

function getListState(username, email) {
  var list = [
    {
      title: "Username",
      subtitle: "@" + username,
      type: 'settings',
      noTap: true
    },
    {
      title: "Email",
      subtitle: email,
      type: 'settings',
      nextIcon: true,
    },
    {
      title: "Password",
      type: 'settings',
      nextIcon: true,
    },
    {
      title: "Log out",
      type: 'settings',
      nextIcon: true,
      actionType: AppConstants.LOGOUT_REQUESTED
    }];
  list.push();

  return {
    items: list
  };
};

var Settings = React.createClass({
  getInitialState() {
    return getListState(this.getUsername(), this.getUserEmail());
  },

  getUsername: function() {
    return CurrentUserStore.get().data.username;
  },

  getUserId: function() {
    return CurrentUserStore.get().data.id;
  },
  getUserEmail: function() {
    return CurrentUserStore.get().data.email;
  },

  render: function() {
    return (
      <View style={styles.flex}>
      <View style={styles.titleView} >
        <Text style={styles.title} >
          Settings
        </Text>
      </View>
        <SimpleListItem style={styles.container} currentRoute={this.props.currentRoute} items={this.state.items} />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: cssVar('thm5'),
    paddingTop: 30
  },
  title: {
    color: cssVar('thm1'),
    fontSize: 24,
    bottom: -10
  },
  titleView: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: cssVar('thm2')
  },
});

module.exports = Settings;
