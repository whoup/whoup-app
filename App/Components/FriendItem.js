var React  = require('react-native');
var {
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var cssVar = require('../Lib/cssVar');
var Icon = require('react-native-vector-icons/Ionicons');
var Text       = require('../Components/Text');
var AppActions = require('../Actions/AppActions');


var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var FriendItem = React.createClass({


  onSelection: function() {
    AppActions.launchRelativeItem(this.props.currentRoute, this.props);
  },

  renderName: function() {
    return (
      <Text style={[styles.name]}>
        @{this.props.name}
      </Text>
    );
  },

  renderSubtitle: function() {
    if (!this.props.subtitle) return null;

    return (
      <Text style={styles.subtitle}>
        {this.props.subtitle}
      </Text>
    );
  },

  renderFriend: function() {
    var name = this.renderName();

    return (
      <View style={[styles.row, styles.notUpBackground]}>
        <View style={[styles.left, styles.rowFlex]}>
          {name}
        </View>
        <View style={styles.right, styles.center}>

        </View>
      </View>
    );
  },

  render: function() {
    return this.renderFriend();
  }
});

var styles = StyleSheet.create({
  upBackground: {
    backgroundColor: cssVar('thm1'),
  },
  notUpBackground: {
    backgroundColor: cssVar('thm3'),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  marBottom: {
    marginBottom: 15,
  },
  rowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontSize: 22,
    color: cssVar('thm2'),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingBottom: 3,
    //fontFamily: 'Helvetica'
  },
  left: {
    flex: 1,
  },
  right: {

  },
  center: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  notUpIcon: {
   marginRight: 10,
   width: 18,
   height: 18,
   backgroundColor: cssVar('thm1')
  },
  upIcon: {
   //paddingLeft: 3,
   backgroundColor: '#18BF17',
  },
  icon: {
    paddingTop: 3
  }
});

module.exports = FriendItem;