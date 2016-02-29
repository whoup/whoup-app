var React = require('react-native');
var Overlay = require('react-native-overlay');
var Text = require('../Componenets/Text');


var {
  View,
  ActivityIndicatorIOS,
  StyleSheet,
  TouchableOpacity,
} = React;

var Toast = React.createClass({
  render(): ReactElement {
    var positionStyle;

    if (this.props.position == 'top' || !this.props.position) {
      positionStyle = styles.top;
    } else {
      positionStyle = styles.bottom;
    }

    return (
      <Overlay isVisible={this.props.isVisible} aboveStatusBar={false}>
        <Text style={ styles.push }>
          { this.props.message }
        </Text>
      </Overlay>
    );
  }
});

var styles = StyleSheet.create({
  top: {
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 9,
  },
  dismissButton: {
    flex: 1,
    backgroundColor: '#eeeeee',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    justifyContent: 'center',
    height: 30,
    marginRight: 15,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#888888',
    fontSize: 12,
  },
})

module.exports = Toast;
