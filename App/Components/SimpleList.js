var React  = require('react-native');
var {
  ListView,
} = React;

var RefreshableListView = require('react-native-refreshable-listview');

var SimpleListItem = require('../Components/SimpleListItem');
var RequestItem = require('../Components/RequestItem');
var SettingsItem = require('../Components/SettingsItem');

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


var SimpleList = React.createClass({
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

    var ListItem;
    if (item.type === 'request') ListItem = RequestItem;
    else if (item.type === 'settings') ListItem = SettingsItem;
    else ListItem = SimpleListItem;

    return (
      <ListItem {...passAlong} {...item} key={"item" + (item.key || rowId)} />
    );
  },

  render: function() {
    var Component = this.props.reloadList ? RefreshableListView : ListView;
    return (
      <Component
        initialListSize={2}
        automaticallyAdjustContentInsets={true}
        dataSource={ds.cloneWithRows(this.props.items)}
        renderRow={this.renderRow}
        loadData={this.props.reloadList}
        minBetweenTime={2000}
      />
    );
  }
});


module.exports = SimpleList;
