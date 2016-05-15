var React  = require('react-native');
var {
  ListView,
  View,
  Text
} = React;

var RefreshableListView = require('react-native-refreshable-listview');

var SimpleListItem = require('../Components/SimpleListItem');
var SettingsItem = require('../Components/SettingsItem');
var DashboardItem = require('../Components/DashboardItem');
var FriendItem = require('../Components/FriendItem');
var RequestAcceptItem = require('../Components/RequestAcceptItem');


//var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


var SectionedList = React.createClass({

  getInitialState: function() {
    return {
        loaded : false,
        dataSource : new ListView.DataSource({
            rowHasChanged           : (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged : (s1, s2) => s1 !== s2
        })
    }
  },

  renderRow: function(item, sectionId, rowId) {
    var passAlong = {};
    if (this.props.currentRoute) passAlong.currentRoute = this.props.currentRoute;
    if (this.props.navigator)    passAlong.navigator    = this.props.navigator;
    if (this.props.nextIcon)     passAlong.nextIcon     = this.props.nextIcon;
    if (this.props.noTap)        passAlong.noTap        = this.props.noTap;
    if (this.props.currUsername) passAlong.currUsername = this.props.currUsername;
    if (this.props.currUid)      passAlong.currUid      = this.props.currUid;
    if (this.props.refreshList)  passAlong.refreshList  = this.props.refreshList;


    if (this.props.getItemProps) {
      // swtich it out
      item = this.props.getItemProps(item);
    }

    var ListItem;
    if (sectionId === 'requests') {
      ListItem = RequestAcceptItem;
    }
    else if (sectionId === 'friends') {
      ListItem = FriendItem;
    }
    else if (item.type === 'settings') ListItem = SettingsItem;
    else if (sectionId === 'up' || sectionId === 'notUp') ListItem = DashboardItem;
    else ListItem = SimpleListItem;

    return (
      <ListItem {...passAlong} {...item} key={"item" + (item.key || rowId)} />
    );
  },

  renderSectionHeader: function(sectionData, sectionId){
    if (sectionId === 'up') {
      return <View/>
    }
    else {
       return (<View style={{height: 15}}/>)
    }

  },

  render: function() {
    var Component = this.props.reloadList ? RefreshableListView : ListView;
    return (
      <Component
        enableEmptySections={true}
        showsVerticalScrollIndicator={false}
        initialListSize={1}
        automaticallyAdjustContentInsets={true}
        dataSource={this.state.dataSource.cloneWithRowsAndSections(this.props.items)}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
        minBetweenTime={2000}
      />
    );
  }
});


module.exports = SectionedList;
