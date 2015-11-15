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
  ListView
} = React;

var CurrentUserStore   = require('../Stores/CurrentUserStore');
var NavigationListener = require('../Mixins/NavigationListener');
var NavBarHelper       = require('../Mixins/NavBarHelper');
var Loading          = require('../Screens/Loading');
var Text             = require('../Components/Text');
var SimpleList       = require('../Components/SimpleList');
var AppActions       = require('../Actions/AppActions');
var FriendActions       = require('../Actions/FriendActions');

var ListHelper = {
  mixins: [NavigationListener, NavBarHelper],

  getInitialState: function() {
    return this.getListState();
  },

  getListState: function() {
    return {
      items: this.getListItems(),
      noFriends: false,
    };
  },

  onListChange: function(arg) {
    if (!this.isListChange || this.isListChange(arg)) {
      this.setState(this.getListState());
    }
  },
  _onChange: function() {
    this.setState(this.getListState());
  },

  onDidFocusNavigation: function() {
    // items may have changed
    this.setState(this.getListState());
  },

  componentDidMount: function() {
    this.props.store.addChangeListener(this._onChange);
    if (this.reloadList) {
      this.reloadList();
    };

  },

  componentWillUnmount: function() {
    this.props.store.removeChangeListener(this._onChange);
  },

  getNavBarState: function() {
    var title = this.props.navBarTitle ? this.props.navBarTitle : "Who Up?";
    return { title: title };
  },

  getUsername: function() {
    if (!this.username) {
      this.username = this.props.username || CurrentUserStore.get().data.username;
    }
    return this.username;
  },
  getUserId: function() {
    return CurrentUserStore.get().data.id;
  },


  renderItems: function() {
    return (
      <SimpleList
        style={styles.flex}
        currentRoute={this.props.currentRoute}
        getItemProps={this.getItemProps}
        items={this.state.items}
        reloadList={this.reloadList}
        {...this.props.listProps}
      />
    );
  },

  renderEmpty: function() {
    if (this.blankContent) return this.blankContent();
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
    var empty;
    if (this.state.items.length === 0) {
      content = this.renderEmpty();
    }
    else {
      content = this.renderItems();
    }
    return (
      <View style={styles.flex}>
        {content}
      </View>
    );
  },

  renderList: function() {
    if (this.state.items === null) {
      return (<View/>
              );
    }
    else if (this.state.items === undefined) {
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
  }
});

module.exports = ListHelper;
