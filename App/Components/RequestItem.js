var React  = require('react-native');
var {
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var cssVar = require('../Lib/cssVar');

var Text       = require('../Components/Text');
var FriendActions = require('../Actions/FriendActions');

var Icon = require('react-native-vector-icons/Ionicons');

var SimpleListItem = React.createClass({

  getInitialState: function() {
    return {
      accepted: false
    }
  },

  onSelection: function() {
    FriendActions.acceptRequest(this.props.id, this.props.title, function(error, success) {
      if (error) {
        alert(error.message);
      } else {
        this.setState({accepted: true});
        this.props.reloadList();
      }
    }.bind(this));
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
    if (!this.props.action) return null;

    // caret-right-semi
    if (this.props.action === 'accept') {
      if (this.state.accepted) {
        return (
          <Icon name={'checkmark'} size={30} color={'green'} style={''} />
        );
      }
      else {
        return (
          <Icon name={'plus'} size={30} color={'black'} style={''} />
        );
      }
    }
    else {
      return (
        <Icon name={'ios-arrow-right'} size={30} color={'black'} style={''} />
      );
    }

  },

  renderContent: function() {
    return (
      <View style={[styles.row, this.props.noTap && styles.touch]}>
        <View style={styles.left}>
          {this.renderTitle()}
          {this.renderSubtitle()}
        </View>
        <View style={styles.right}>
          {this.renderRightIcon()}
        </View>
      </View>
    );
  },

  render: function() {
    if (this.props.noTap) {
      return this.renderContent();
    }

    return (
      <View>
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
    alignItems: 'center',
    padding:20
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    paddingTop: 5,
    fontSize: 14,
    color: cssVar('gray20'),
  },
  left: {
    flex: 1,
  },
  right: {

  },
  rightIcon: {
    fontFamily: cssVar('fontIcon'),
    color: cssVar('gray30'),
    fontSize: 12,
  }
});

module.exports = SimpleListItem;
