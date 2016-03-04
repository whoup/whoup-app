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
var FriendActions = require('../Actions/FriendActions');


var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var RequestAcceptItem = React.createClass({

  getInitialState: function() {
    return { loading: false}
  },

  onSelection: function() {
    this.setState({loading: true})
    FriendActions.acceptRequest(this.props.id, this.props.username, this.props.currUid, this.props.currUsername, function(error) {
      if (error) {
        // TODO: better error handling
        alert(error.message);
      }
      else {
        this.setState({loading: false, accepted: true})
      }
    }.bind(this));
  },

  renderName: function() {
    return (
      <Text style={[styles.name, this.state.accepted && styles.acceptedName]}>
        @{this.props.name}
      </Text>
    );
  },

  addButton: function() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicatorIOS color={cssVar('thm2')} />
        </View>)
    } else if (this.state.accepted) {
      return (<Image style={styles.plus} source={{uri: 'check'}}/>);
    }
    else {
      return (
        <TouchableWithoutFeedback onPress={this.onSelection}>
          <Image style={styles.plus} source={{uri: 'plus_y'}}/>
        </TouchableWithoutFeedback>
      );
    }
  },

  renderFriend: function() {
    var name = this.renderName();
    var button = this.addButton();
    return (
      <View style={[styles.row, styles.background, this.state.accepted && styles.accepted]}>
        <View style={[styles.left, styles.rowFlex]}>
          {name}
        </View>
        <View style={[[styles.mar_left, styles.right]]}>
          {button}
        </View>
      </View>
    );
  },

  render: function() {
    return this.renderFriend();
  }
});

var styles = StyleSheet.create({
  background: {
    backgroundColor: cssVar('thm2'),
  },
  accepted: {
    backgroundColor: cssVar('thm3'),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
  },
  marBottom: {
    marginBottom: 15,
  },
  rowFlex: {
    flexDirection: 'row',

  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontSize: 22,
    color: cssVar('thm3'),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingBottom: 3,
  },
  acceptedName: {
    color: cssVar('thm2'),
  },
  left: {
    flex: 1,
  },
  right: {

  },
  mar_left: {
    //marginLeft: 10,
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
   backgroundColor: '#18BF17',
  },
  icon: {
    paddingTop: 3
  },
  plus: {
    width: 20,
    height: 20,
    marginRight: 15
  },
  loading: {
    width: 30,
    height: 30,
    justifyContent: 'center',
  },
});

module.exports = RequestAcceptItem;
