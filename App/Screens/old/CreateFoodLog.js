var React = require('react-native');
var {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ProgressViewIOS,
} = React;

var TextInput   = require('../Components/TextInput');
var Button      = require('../Components/Button');
var PostActions = require('../Actions/PostActions');
var AppActions  = require('../Actions/AppActions');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var NavBarHelper = require('../Mixins/NavBarHelper');

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var Icon = require('react-native-vector-icons/Ionicons');
var KeyboardListener = require('../Mixins/KeyboardListener');


var CreateActivityLog = React.createClass({
  mixins: [KeyboardListener, NavBarHelper],

  getInitialState: function() {
    return {
      description: '',
      image: '',
      time: new Date(),
      editingTime: false,
      imageChosen: false,
      loading: false,
      uploadProgress: null
    };
  },

  updateProgress: function(e) {
    this.setState({uploadProgress: e.loaded/ e.total})
  },

  onSubmitButton: function() {

    var data = new FormData();
    data.append('description', this.state.description);
    data.append('image', this.state.image);
    data.append('time', this.state.time.toISOString());
    PostActions.createFoodLog(data, function(e) {
      this.updateProgress(e);
    }.bind(this),
    function(error) {
      if (error) {
        // TODO: better error handling
        alert(error.message);
      }
      else {
        PostActions.fetchList(CurrentUserStore.get().data.username, function(error) {
          // TODO: handle error
          if (error) {
            alert(error.message);
          }
        });

        AppActions.goBack(this.props.navigator);
      }
    }.bind(this));
    this.setState({loading: true})
  },

  getNavBarState: function() {
    var title = this.state.loading ? 'Creating...' : 'Create Food Log';
    return { title: title };
  },

  toggleDurationEdit: function() {
    this.setState({editingTime: !this.state.editingTime})
  },

  changeDuration: function(time) {
    this.setState({time: time});
  },


  _takePicture: function() {
    var options = {
      title: 'Select Food Image', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      maxWidth: 1080,
      maxHeight: 1080,
      quality: 0.8,
      allowsEditing: true, // Built in iOS functionality to resize/reposition the image
    };

    // The first arg will be the options object for customization, the second is
    // your callback which sends bool: didCancel, object: response.
    //
    // response.data is the base64 encoded image data
    // response.uri is the uri to the local file asset on the device
    // response.isVertical will be true if the image is vertically oriented
    UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
      //console.log('Response = ', response);

      if (didCancel) {
        //console.log('User cancelled image picker');
      }
      else {
        if (response.customButton) {
          //console.log('User tapped custom button: ', response.customButton);
        }
        else {
          // You can display the image using either:
          const source = {uri: response.uri.replace('file://', ''), isStatic: true, name: 'image.jpg'};

          this.setState({
            image: source,
            imageChosen: true
          });
        }
      }
    });

  },

  renderProgress: function() {
    if (this.state.loading) {
      return (
        <ProgressViewIOS progress={this.state.uploadProgress}/>
      );
    }
    else {
      return (
        <View />
      );
    }
  },

  renderTime: function() {
    if (this.state.editingTime) {
      return (
        <TextInput
          clearTextOnFocus={false}
          autoFocus={true}
          onSubmitEditing={this.toggleDurationEdit}
          onBlur={this.toggleDurationEdit}
          onChangeText={this.changeDuration}
          keyboardType={'numeric'}
          style={[styles.right, styles.timeEdit]}
          value={this.state.time.toString()}
        />
      )
    }
    else {
      return (
        <Text style={[styles.right, styles.timeLabel]} onPress={this.toggleDurationEdit}>
          {this.state.time.toString()}
        </Text>
      )
    }
  },

  renderImage: function() {
    if (this.state.imageChosen) {
      return (
        <View style={[styles.image, styles.imageIcon]}>
          <TouchableOpacity onPress={this._takePicture} >
            <Image style={styles.image}
              source = {{uri: this.state.image.uri}}/>
          </TouchableOpacity>
        </View>
      );
    }
    else {
      return (
        <View style={[styles.image, styles.imageIcon]}>
          <TouchableOpacity onPress={this._takePicture}>
            <Icon name="plus" size={30} color="#000" />
          </TouchableOpacity>
        </View>

      );
    }
  },

  render: function() {
    var progress = this.renderProgress();
    var timeEdit = this.renderTime();
    var imageEdit = this.renderImage();
    return (

      <View style={styles.flex}>
        {progress}
        <View style={[styles.flex, this.state.loading && styles.loading]}>
          <View style={[styles.qFlex, styles.inline, styles.input]} >
            <Text style={[styles.timeLabel, styles.left]}> Time: </Text>
              {timeEdit}
          </View>
          <View style={[styles.flex, styles.input]}>
            <TextInput ref="content"
              placeholder={"What did you eat?"}
              keyboardType="default"
              multiline={true}
              autoFocus={false}
              style={styles.textInput}
              enablesReturnKeyAutomatically={true}
              returnKeyType='done'
              onChange={(event) => this.state.description = event.nativeEvent.text }
            />
          </View>
          <View style={[styles.flex, styles.input, styles.footer, styles.inline]}>
            <View style={[styles.left]}>
              {imageEdit}
            </View>
            <View style={[styles.right, styles.bottom]}>
              <Button type='blue' style={styles.button} onPress={this.onSubmitButton}>
                Submit
              </Button>
            </View>
          </View>
          <View style={{height: this.state.keyboardSpace}}></View>
        </View>
      </View>
    );
  },

});

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  loading: {
    opacity: 0.3
  },
  qFlex: {
    flex: 0.25
  },
  input: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    backgroundColor: 'white',
  },
  footer: {
    padding: 10
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'white',
    padding: 20
  },
  inline: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  timeLabel: {
    fontSize: 18
  },
  timeEdit: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 18,

  },
  left: {
    flex: 1,
  },
  right: {

  },
  bottom: {
    justifyContent: 'flex-end',
  },
  button: {
    // width: 150
  },
  image: {
    width: 140,
    height: 140,
    borderColor: 'gray',
    borderWidth: 1,
  },
  imageIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D3D3D3'
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

module.exports = CreateActivityLog;
