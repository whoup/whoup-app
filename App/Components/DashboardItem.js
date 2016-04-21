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

var DashboardItem = React.createClass({
  onSelection: function() {
    //console.log(this.props)
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

  renderRightIcon: function() {
    if (!this.props.nextIcon) return null;
    return (
      <Icon name={'ios-arrow-right'} size={30} color={'black'} style={styles.icon}/>
    );
  },

  renderContent: function() {
    var name = this.renderName();
    var up = this.props.up == true;

    return (
      <View style={[styles.row, styles.notUpBackground, up && styles.upBackground]}>
        <View style={[styles.left, styles.rowFlex]}>
          <View style={[styles.notUpIcon, up && styles.upIcon]} />
          {name}
        </View>
        <View style={styles.right, styles.center}>
          {this.renderRightIcon()}
        </View>
      </View>
    );
  },

  render: function() {
    //console.log(this.state);
    if (this.props.noTap) {
      return this.renderContent();
    }

    return (
      <View style={styles.marBottom} >
        <TouchableHighlight
              style={styles.touch}
              underlayColor={cssVar('gray10')}
              onPress={this.onSelection}
        >
          {this.renderContent()}
        </TouchableHighlight>
        <View style={cssVar('listFullLine')} />
      </View>
    );
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
    //marginBottom: 15,
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
   backgroundColor: cssVar('gray30')
  },
  upIcon: {
   //paddingLeft: 3,
   backgroundColor: cssVar('thm4'),
  },
  icon: {
    paddingTop: 3
  }
});

module.exports = DashboardItem;
