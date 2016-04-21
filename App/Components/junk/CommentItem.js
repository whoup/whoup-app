var React  = require('react-native');
var {
  View,
  StyleSheet
} = React;

var cssVar = require('../Lib/cssVar');

var Text       = require('../Components/Text');
var AppActions = require('../Actions/AppActions');

var SimpleListItem = React.createClass({


  render: function() {

    return (
      <View>
        <Text style={[styles.comment]}>
          <Text style={styles.commentor}>
            {this.props.username + ' '}
          </Text>
          {this.props.text}
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  commentor: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  comment: {
    fontSize: 16,
    textAlign: 'justify'
  },
});

module.exports = SimpleListItem;
