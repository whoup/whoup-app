// helper to handle showing lists of things
// parent must implement methods
// required: getListItem, getItemProps
// optional: isListChange, reloadList
//
// and give props
// required: store, currentRoute
// optional: listProps, segment

var React = require('react-native');
var {
  View,
  StyleSheet,
  ListView,
  ProgressViewIOS
} = React;

var CurrentUserStore   = require('../Stores/CurrentUserStore');
var NavigationListener = require('../Mixins/NavigationListener');
var NavBarHelper       = require('../Mixins/NavBarHelper');

var Loading          = require('../Screens/Loading');
var Text             = require('../Components/Text');
var AppActions       = require('../Actions/AppActions');
var CommentItem = require('../Components/CommentItem');

// change to comment input or generalise to make it footerinput
var CommentInput = require('../Components/CommentInput');

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var CommentHelper = {
  mixins: [NavigationListener, NavBarHelper],

  getInitialState: function() {
    return this.getListState();
  },

  getListState: function() {
    return {
      items: this.getListItems(),
      sending: false,
      progress: null,
      logData: this.props.passProps
    };
  },

  toggleSending: function() {
    this.setState({sending: (!this.state.sending)})
  },

  updateProgress: function(e) {
    this.setState({progress: e.loaded/e.total})
  },

  getNavBarState: function() {
    var title = this.state.sending ? 'Sending...' : this.props.navBarTitle;
    return { title: title };
  },

  onListChange: function(arg) {
    if (!this.isListChange || this.isListChange(arg)) {
      this.setState(this.getListState());
    }
  },

  _onChange: function() {
    this.setState(this.getListState());
  },

  messageAdded: function() {
    this.reloadList();
  },

  onDidFocusNavigation: function() {
    // items may have changed
    this.setState(this.getListState());
  },


  getUsername: function() {
    if (!this.username) {
      this.username = this.props.username || CurrentUserStore.get().data.username;
    }
    return this.username;
  },

  renderProgress: function() {
    if (this.state.sending) {
      return (
        <ProgressViewIOS progress={this.state.progress}/>
      );
    }
    else {
      return (
        <View />
      );
    }
  },

  renderCommentRow: function(item, sectionId, rowId) {

    return (
      <CommentItem {...item} key={'item'+ (item.id || rowId)}/>
    )
  },

  renderItems: function() {
    return (
      <ListView
        automaticallyAdjustContentInsets={true}
        dataSource={ds.cloneWithRows(this.state.items)}
        renderRow={this.renderCommentRow}
        getItemProps={this.getItemProps}
        bounces={false}
        scrollEnabled={false}
      />
    );
  },

  renderEmpty: function() {
    return(
      <View style={styles.container} >
        <Text style={styles.description}>
          No Content
        </Text>
      </View>
    );
  },

  renderContent: function() {
    var content;
    var progress = this.renderProgress();
    if (this.state.items.length === 0) {
      content = this.renderEmpty();
    }
    else {
      content = this.renderItems();
    }
    return (
      <View style={styles.flex}>
        {progress}
        {content}
        <CommentInput toggleSubmitting={this.toggleSending} updateProgress={this.updateProgress}
          logType={this.state.logData.type} navigator={this.props.navigator} logId={this.state.logData.log_id} />
      </View>
    );
  },

  render: function() {
    if (!this.state.items) {
      // TODO: load error?
      return <Loading />;
    }
    else {
      return this.renderContent();
    }
  }
};

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#123456',
  },
  flex: {
    flex: 1
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'white',
    padding: 20
  },
  button: {
    // width: 150
  },
  footer: {
    padding: 10,
    flexDirection: 'row'
  }
});

module.exports = CommentHelper;
