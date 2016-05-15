var React = require('react-native');
var {
  View,
  StyleSheet
} = React;

var Camera = require('react-native-camera');

var KeyboardListener = require('../Mixins/KeyboardListener');


var CreatePost = React.createClass({
  mixins: [KeyboardListener],

  getInitialState: function() {
    return {
      content: '',
      cameraType: Camera.constants.Type.back
    };
  },

  onSubmitButton: function(data) {
    PostActions.createFoodLog({image: {data, name: 'image.jpg'}}, function(error) {
      if (error) {
        // TODO: better error handling
        alert(error.message);
      }
      else {
        AppActions.goBack(this.props.navigator);
      }
    }.bind(this));
  },

  render: function() {
    return (
    <Camera
      ref="cam"
      style={styles.container}
      type={this.state.cameraType}
    >
      <View style={styles.container}>
        <View style={styles.container}>

        </View>
        <View style={[styles.container]}>
          <TouchableHighlight style={styles.footer} onPress={this._takePicture} >
            <Text> Some Text </Text>
          </TouchableHighlight>
        </View>

      </View>
    </Camera>
    );
  },

  _onBarCodeRead: function(e) {
    console.log(e);
  },
  _switchCamera: function() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  },
  _takePicture: function() {
    var data;
    this.refs.cam.capture(function(err, data) {
      console.log(data);
      PostActions.createFoodLog({image: {uri: data, name: 'image.jpg'}}, function(error) {
      if (error) {
        // TODO: better error handling
        alert(error.message);
      }
      else {
        AppActions.goBack(this.props.navigator);
      }
    }.bind(this));

    });
  }

});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'white',
    padding: 20
  },
  button: {
    // width: 150
  },
  camera: {
    flex: 10,
    flexWrap: 'wrap',
    backgroundColor: 'transparent'
  },
  footer: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row'
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: 'white',
  },
});

module.exports = CreatePost;
