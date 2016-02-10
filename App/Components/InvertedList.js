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
        initialListSize={30}
        style={{paddingTop: 30}}
        automaticallyAdjustContentInsets={true}
        renderScrollComponent={(props) => (<InvertibleScrollView {...props} inverted />)}
        dataSource={ds.cloneWithRows(this.props.items, rowIds)}
        renderRow={this.renderRow}
        loadData={this.props.reloadList}
        minBetweenTime={2000}
      />
    );
  }
});

module.exports = InvertedList;
