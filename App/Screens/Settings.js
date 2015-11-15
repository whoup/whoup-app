var React  = require('react-native');
var {
  View,
  StyleSheet
} = React;

var SimpleListItem   = require('../Components/SimpleList');
var AppConstants = require('../Constants/AppConstants');
var cssVar = require('../Lib/cssVar');
function getListState() {
  var list = [];
  list.push({
    title: "Log out",
    actionType: AppConstants.LOGOUT_REQUESTED
  });


  return {
    items: list
  };
};

var Settings = React.createClass({
  getInitialState() {
    return getListState();
  },

  render: function() {
    return (
      <View style={styles.container}>
        <SimpleListItem currentRoute={this.props.currentRoute} items={this.state.items} />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cssVar('thm5'),
  }
});

module.exports = Settings;
