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

var SettingsItem = React.createClass({

  onSelection: function() {
    AppActions.launchRelativeItem(this.props.currentRoute, this.props);
  },

  renderTitle: function() {
    if (!this.props.title) return null;

    return (
      <Text style={styles.title}>
        {this.props.title}
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
      <Icon name={'ios-arrow-right'} size={24} style={styles.rightIcon} />
    );
  },

  renderContent: function() {
    return (
      <View style={[styles.row, this.props.noTap && styles.touch]}>
        <View style={styles.left}>
          {this.renderTitle()}

        </View>
        <View style={styles.right}>
          {this.renderSubtitle()}
          {this.renderRightIcon()}
        </View>
      </View>
    );
  },

  render: function() {
    if (this.props.noTap) {
      return (
        <View style={styles.marBottom}>
          {this.renderContent()}
        </View>
      )

    }

    return (
      <View style={styles.marBottom}>
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
  touch: {
    backgroundColor: 'white'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15
  },
   marBottom: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: cssVar('fontLight'),
    color: cssVar('thm2'),
  },
  subtitle: {
    paddingTop: 5,
    fontSize: 18,
    lineHeight: 18,
    color: cssVar('thm6'),
  },
  left: {
    flex: 1,
  },
  right: {
    flexDirection: 'row'
  },
  rightIcon: {
    color: cssVar('thm6'),
    marginLeft: 8,
  }
});

module.exports = SettingsItem;
