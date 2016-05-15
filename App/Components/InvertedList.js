var React  = require('react-native');
var {
  ListView
} = React;

var RefreshableListView = require('react-native-refreshable-listview');

var InvertibleScrollView = require('react-native-invertible-scroll-view');

var ChatItem = require('../Components/ChatItem');

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


var InvertedList = React.createClass({
  renderRow: function(item, sectionId, rowId) {
    var passAlong = {};
    if (this.props.currentRoute) passAlong.currentRoute = this.props.currentRoute;
    if (this.props.navigator)    passAlong.navigator    = this.props.navigator;
    if (this.props.nextIcon)     passAlong.nextIcon     = this.props.nextIcon;
    if (this.props.noTap)        passAlong.noTap        = this.props.noTap;

    if (this.props.getItemProps) {
      // swtich it out
      item = this.props.getItemProps(item);
    }

    var ListItem = ChatItem;
    return (
      <ListItem {...passAlong} {...item} key={"item" + (item.key || rowId)} />
    );
  },

  onPress: function() {
    this.props.hideNavBar()
  },

  render: function() {
    var Component = this.props.reloadList ? RefreshableListView : ListView;
    var rowIds = this.props.items.map((row, index) => index).reverse();
    return (
      <Component
        initialListSize={10}
        enableEmptySections={true}
        removeClippedSubviews={true}
        style={{paddingTop: 30}}
        onEndReachedThreshold={0}
        onEndReached={this.props.onEndReached}
        automaticallyAdjustContentInsets={true}
        renderScrollComponent={(props) => (<InvertibleScrollView {...props} inverted={true} keyboardDismissMode={'on-drag'} />)}
        dataSource={ds.cloneWithRows(this.props.items, rowIds)}
        renderRow={this.renderRow}
        loadData={this.props.reloadList}
        pageSize={10}
        minBetweenTime={2000}
      />
    );
  }
});

module.exports = InvertedList;
