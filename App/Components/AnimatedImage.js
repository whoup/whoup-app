var React = require('react-native')

var {
  AppStateIOS
} = React;

var cssVar = require('../Lib/cssVar');

var AnimatedImage = React.createClass({
  propTypes: React.Image.propTypes,

  getInitialState: function() {
    return{
            appState: 'active'
          }
  },

  componentDidMount: function() {
    AppStateIOS.addEventListener('change', this._handleAppStateChange);
  },

  componentWillUnmount: function() {
   AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  },

  _handleAppStateChange: function(currentAppState) {
    //console.log(currentAppState);
    this.setState({ appState: currentAppState  });
  },

  setNativeProps() {
    var image = this.refs.image;
    image.setNativeProps.apply(image, arguments);
  },
  render() {
    if (this.state.appState === 'active'){
      return (
        <React.Image
          {...this.props}
          ref="image"
          defaultSource={{uri: this.props.inactive}}
          source={{uri: this.props.active}}
          style={[this.props.style || {}]}
        />
      );
    } else {
      return (
        <React.Image
          {...this.props}
          ref="image"
          defaultSource={{uri: this.props.inactive}}
          source={{uri: this.props.inactive}}
          style={[this.props.style || {}]}
        />
      );
    }

  }
})


module.exports = AnimatedImage;
