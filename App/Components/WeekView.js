// https://github.com/ide/react-native-button

var React = require('react-native');
var {
  StyleSheet,
  TouchableOpacity,

  View
} = React;

var cssVar     = require('../Lib/cssVar');
var Text       = require('../Components/Text');
var AppActions = require('../Actions/AppActions');
//var ScrollableTabView = require('react-native-scrollable-tab-view');

var WeekView = React.createClass({

  dayComponents: function() {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    var d = new Date();
    var weekday = new Array(7);
    weekday[0]=  "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var n = weekday[d.getDay()];


    var out = [];
    for(var i = 0; i < this.props.items.length; i++) {
      var item = this.props.items[i];
      out.push(
        <DayItem {...item} key={"Day" + i} currentRoute={this.props.currentRoute} updateDay={this.props.updateDay}/>
      );
    };
    return out;
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.control}>
          {this.dayComponents()}
        </View>
      </View>
    );
  }
});

var DayItem = React.createClass({

  onSelection: function() {
    this.props.updateDay(this.props.title);
  },

  render: function() {
    if (this.props.selected) {
      return (
        <View
          style={styles.flex}
        >
          <View style={[styles.button, styles.selectedButton]}>
            <Text style={[styles.text, styles.selectedText]}>
              {this.props.title}
            </Text>
          </View>
        </View>
      );
    }
    else {
      return (
        <TouchableOpacity
          style={[styles.flex, styles.button]}
          onPress={this.onSelection}
        >
          <View style={[styles.button, styles.linkButton]}>
            <Text style={[styles.text, styles.linkText]}>
              {this.props.title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }
});


var styles = StyleSheet.create({
  container: {
    backgroundColor: cssVar('blue50'),
  },
  control: {
    flex: 1,
    flexDirection: 'row',
    borderColor: cssVar('blue50'),
    borderWidth: 1,
    borderRadius: 0
  },
  flex: {
    flex: 1
  },
  button: {
    padding: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0
  },
  selectedButton: {
    backgroundColor: 'white',
  },
  linkButton: {
    backgroundColor: cssVar('blue50'),
  },
  text: {
    fontSize: 16
  },
  selectedText: {
    color: cssVar('blue50'),
  },
  linkText: {
    color: 'white'
  }
});

module.exports = WeekView;
