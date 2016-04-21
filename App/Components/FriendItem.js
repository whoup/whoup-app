var React  = require('react-native');
var {
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var cssVar = require('../Lib/cssVar');
var Icon = require('react-native-vector-icons/Ionicons');
var Text       = require('../Components/Text');
var FriendActions = require('../Actions/FriendActions');
var Swipeout = require('react-native-swipeout')

var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var FriendItem = React.createClass({

  getInitialState: function (){
    return {open: true}
  },

  deleteFriend: function() {
    FriendActions.deleteFriend(this.props.id, this.props.currUid, this.friendDeleted);
  },

  friendDeleted: function(error){
    if (error) {
      alert(error.message);
    } else {
      this.props.refreshList();
    }
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

      <View style={[styles.flex, styles.seperate, styles.notUpBackground]}>
        <Swipeout backgroundColor={cssVar('thm3')}  open={true} right={[{text: 'Delete', type: 'delete', onPress: this.deleteFriend}]}>
          <View style={styles.row} >
            <View style={[styles.left, styles.rowFlex]}>
              {name}
            </View>
            <View style={styles.right}>
              <Icon name={'ios-arrow-left'} size={30} color={cssVar('thm2')} style={[styles.imageRIcon]} />
            </View>
          </View>
        </Swipeout>
      </View>

    );
  },

  render: function() {
    return this.renderFriend();
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  upBackground: {
    backgroundColor: cssVar('thm1'),
  },
  notUpBackground: {
    backgroundColor: cssVar('thm3'),
  },
  imageRIcon: {
    alignSelf: 'flex-end'
  },
  row: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,

    paddingLeft: 15,
    paddingRight: 15
  },
  seperate: {
    marginBottom: 15,
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
