var React  = require('react-native');
var {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicatorIOS,
  Image
} = React;

var cssVar = require('../Lib/cssVar');
var Icon = require('react-native-vector-icons/Ionicons');
var Text       = require('../Components/Text');
var AppActions = require('../Actions/AppActions');
var FriendActions = require('../Actions/FriendActions');

var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var RequestItem = React.createClass({

  getInitialState: function() {
    return {  loading: this.props.loading,
              sent: this.props.sent
            }
  },

  onSubmitButton: function() {
    this.setState({loading: true})
    FriendActions.addFriend(this.props.id, this.props.username, function(error) {
      if (error) {
        // TODO: better error handling
        alert(error.message);
      }
      else {
        this.setState({loading: false, sent: true})
      }
    }.bind(this));

  },


  addButton: function() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicatorIOS color={cssVar('thm2')} />
        </View>)
    } else if (this.props.isFriend || this.state.sent) {
      return (<Image style={styles.plus} source={{uri: 'check'}}/>);
    }
    else {
      return (
        <TouchableWithoutFeedback onPress={this.onSubmitButton}>
          <Image style={styles.plus} source={{uri: 'plus_b'}}/>
        </TouchableWithoutFeedback>
      );
    }
  },

  render: function() {
    var button = this.addButton();
    return (
      <View style={[styles.row, styles.inline]}>
        <Image style={styles.owl} source={{uri: 'owl_b'}}/>
        <Text style={[styles.username, styles.left, styles.mar_left]}>
          @{this.props.username}
        </Text>
        <View style={[styles.mar_left, styles.right]}>
          {button}
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  row: {
    marginTop: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    height: 54,
  },
  loading: {
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  owl: {
    width: 32,
    height: 32,
    marginLeft: 10,
    marginRight: 5
  },
  inline: {
    flexDirection: 'row',
  },
  username: {
    color: cssVar('thm2'),
    fontSize: 20,
    lineHeight: 0
  },
  left: {
    flex: 1,
  },
  right: {

  },
  mar_left: {
    marginLeft: 10,
  },
  plus: {
    width: 20,
    height: 20,
    marginRight: 15
  },
});

module.exports = RequestItem;
