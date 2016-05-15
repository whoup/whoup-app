var React = require('react-native');
var StatusBar = require('../Platform/StatusBar');
var Text = require('../Components/Text');
var cssVar = require('../Lib/cssVar');
var {
  NetInfo,
  View,
  StyleSheet
} = React;

import Dimensions from 'Dimensions';

var IsConnected = React.createClass({
  getInitialState: function() {
    return {
      isConnected: null,
    };
  },
  componentDidMount: function() {
    NetInfo.isConnected.addEventListener(
        'change',
        this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
        (isConnected) => {
          StatusBar.setHidden(!isConnected);
          this.setState({isConnected});
        }
    );
  },
  componentWillUnmount: function() {
    NetInfo.isConnected.removeEventListener(
        'change',
        this._handleConnectivityChange
    );
  },
  _handleConnectivityChange: function(isConnected) {
    StatusBar.setHidden(!isConnected);
    this.setState({
      isConnected,
    });
  },
  render() {
    if (this.state.isConnected) {
      return <View/>
    }
    return (
        <View style={styles.container}>
          <Text style={styles.copy}>No Internet Connection</Text>
        </View>
    );
  }
});

var SCR_WDTH = Dimensions.get('window').width;
var styles = StyleSheet.create({
  container: {
    width: SCR_WDTH,
    height: 20,
    top: 0,
    position: 'absolute',
    backgroundColor: 'red',
  },
  copy: {
    color: cssVar('thm3'),
    textAlign: 'center',
    fontSize: 15,
  },
});

module.exports = IsConnected;
