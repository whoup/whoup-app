// https://github.com/ide/react-native-button

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  View
} = React;

var cssVar     = require('../Lib/cssVar');
var Text       = require('../Components/Text');
var AppActions = require('../Actions/AppActions');

var ScrollSelect = React.createClass({
  scrollableComponents: function() {
    var out = [];
    for(var i = 0; i < this.props.items.length; i++) {
      var item = this.props.items[i];
      out.push(
        <Badge {...item} key={"item" + i} currentRoute={this.props.currentRoute} onButtonSelect={this.props.onButtonSelect}/>
      );
    };
    return out;
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.control}>
          {this.scrollableComponents()}
        </View>
      </View>
    );
  }
});

var Badge = React.createClass({

  onSelection: function() {
    this.props.onButtonSelect(this.props.label);
  },

  render: function() {
    if (this.props.selected) {
      return (
        <View
          style={styles.flex}
        >
          <View style={[styles.button, styles.selectedButton]}>
            <Text style={[styles.text, styles.selectedText]}>
              {this.props.label}
            </Text>
          </View>
        </View>
      );
    }
    else {
      return (
        <TouchableHighlight
          style={styles.flex}
          underlayColor='#FFFFFF'
          onPress={this.onSelection}
        >
          <View style={[styles.button, styles.linkButton]}>
            <Text style={[styles.text, styles.linkText]}>
              {this.props.label}
            </Text>
          </View>
        </TouchableHighlight>
      );
    }
  }
});


var styles = StyleSheet.create({
  container: {
    backgroundColor: cssVar('gray30'),
    padding: 10
  },
  control: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 4
  },
  flex: {
    flex: 1
  },
  button: {
    padding: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

module.exports = ScrollSelect;
