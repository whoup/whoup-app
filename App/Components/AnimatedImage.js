var React = require('react-native')

var {
  AppStateIOS,
  TouchableWithoutFeedback
} = React;

var cssVar = require('../Lib/cssVar');
var Animatable = require('react-native-animatable');

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

  setNativeProps: function() {
    var image = this.refs.image;
    image.setNativeProps.apply(image, arguments);
  },

  onTap: function(){
    if (this.props.tap) {
      this.refs.image.bounce(1200);
    }
  },

  render: function() {
    if (this.state.appState === 'active'){
      return (
        <TouchableWithoutFeedback onPress={this.onTap}>
          <Animatable.Image
            {...this.props}
            ref="image"
            defaultSource={{uri: this.props.inactive}}
            source={{uri: this.props.active}}
            style={[this.props.style || {}]}
          />
        </TouchableWithoutFeedback>
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
