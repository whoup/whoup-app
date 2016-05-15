var React = require('react-native');
var {
  View,
  StyleSheet,
  Image
} = React;

var TextInput   = require('../Components/TextInput');
var Button      = require('../Components/Button');
var ChatActions = require('../Actions/ChatActions');
var AppActions  = require('../Actions/AppActions');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var cssVar = require('../Lib/cssVar');
var KeyboardListener = require('../Mixins/KeyboardListener');

var dismissKeyboard = require('dismissKeyboard');

var ImagePickerManager = require('NativeModules').ImagePickerManager;
var ImageUploader = require('../Api/ImageUploader');
var FirebaseRef = require('../Api/FirebaseRef');

var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var client = require('../Api/HTTPClient')


var ChatInput = React.createClass({
  mixins: [KeyboardListener],

  getInitialState: function() {
    return this.blankContent();
  },

  blankContent: function() {
    return {
      body: '',
      height: 0,
      chosen: false,
      image: false
    };
  },

  updateText: function(text, height) {
    var oldHeight = this.state.height;
    this.setState({
      body: text,
      height: height
    });
    // if (/\/gif/.match()) {
    //   this.setState({gif: true,

    //   })
    //   return;
    // }

    if (text.length > oldHeight){
      if (text.match(/\/gif/)) {
        this.setState({gif: true,
          search: text.replace(/^\/gif/, '')
        })
        return;
      }

      var url_regex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g;
      var matches = text.match(url_regex);
      if (matches){
        client.retreive("http://opengraph.io/api/1.0/site/" + matches[0] , null, (err, data) => {
          if (err || data.error) return console.log('shit');

          if (/image/.test(data.openGraph.type) || /.*.gif/.test(data.openGraph.image)){
            this.onSubmit(data.openGraph.image, true);
            this.setState({
              body: text.replace(matches[0], ''),
            });
          }
        });
      }
    }
  },
  clearText: function() {
    this.setState(this.blankContent);
  },

  toggleSubmitting: function() {
    this.setState({submitting: (!this.state.submitting)})
  },


  onSubmitButton: function() {
    this.onSubmit(this.state.body, false);
    this.clearText();
  },


  onSubmitImage: function(image) {
    this.toggleSubmitting();


    ImageUploader(image, (error, response) => {
      if (error) console.log('error');

      this.setState({imageData: ''});
      this.toggleSubmitting();
      this.onSubmit(response, true);

    }, this.props.updateProgress);


    // path will be something like
  },


  onSubmit: function(body, image) {
    if ((!this.state.submitting || image) && body !== '') {

      var friendId = this.props.friendId;
      var fromUsername = this.props.username;
      var fromId = this.props.currUid

      var toggleSub = this.toggleSubmitting;

      var togglePropSub = this.props.toggleSubmitting;
      var postEnd = 'users/' + friendId + '/messages/' + fromId;
      var currUsrEnd = 'users/' + fromId + '/messages/' + friendId;

      this.toggleSubmitting();
      base.push(postEnd, {
        data: {body: body, received: true, image: image, timestamp: Firebase.ServerValue.TIMESTAMP},
        then(){
          base.push(currUsrEnd, {
            data: {body: body, received: false, image: image, timestamp: Firebase.ServerValue.TIMESTAMP},
            then(){
                toggleSub();
                base.push('/push-notifs/tasks', {
                  data: {
                    to: friendId,
                    from: fromId,
                    message: '@' + fromUsername + ' just sent you a message',
                    type: 'message',
                    username: fromUsername,
                    sound: "ping.aiff"
                  }
                })
            }
          })
        }
      });
    };
  },

  _takePicture: function() {
    var options = {
      title: '', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      quality: 0.8,
      allowsEditing: false, // Built in iOS functionality to resize/reposition the image
      mediaType: 'photo',
      noData: true
    };

    // The first arg will be the options object for customization, the second is
    // your callback which sends bool: didCancel, object: response.
    //
    // response.data is the base64 encoded image data
    // response.uri is the uri to the local file asset on the device
    // response.isVertical will be true if the image is vertically oriented
    ImagePickerManager.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};

        this.onSubmitImage(source.uri);
      }
    });

  },

  renderPicker: function(){
    return (
      <ListView

      />
    )
  },


  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.footer}>
          <View style={[styles.inputButton]}>
          <Button type='blue' style={styles.button} disabled={this.state.submitting} onPress={this._takePicture}>
            <Image style={[styles.cameraIcon]} source={{uri: 'camera'}} />
            </Button>
           </View>
          <View style={styles.inputContainer}>

            <TextInput ref={"chat"}
              placeholder={"Chat"}
              placeholderStyle={styles.placeholder}
              keyboardType={"default"}
              keyboardAppearance={"dark"}
              multiline={true}
              clearTextOnFocus={false}
              autoFocus={false}
              style={[styles.input, {height: Math.max(38, this.state.height)}]}
              enablesReturnKeyAutomatically={true}
              returnKeyType={'default'}
              onChange={(event) => {
                this.updateText(event.nativeEvent.text, event.nativeEvent.contentSize.height);
              }}

              value={this.state.body}
              />
          </View>
          <View style={[styles.inputButton]}>
            <Button type='blue' style={styles.button} disabled={this.state.submitting} onPress={this.onSubmitButton}>
                Send
            </Button>
          </View>
        </View>
        <View style={{height: this.state.keyboardSpace, backgroundColor: 'black'}}/>
      </View>

      );
  }
});

var styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    fontSize: 17,
    paddingTop: 3,
    borderRadius: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Helvetica',
    borderColor: 'white'
  },
  inputContainer: {
    flex: 1,

  },
  image: {
    width: 300,
    height: 400,

  },
  cameraIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  placeholder: {
    fontStyle: 'italic'
  },
  container: {
    backgroundColor: cssVar('gray1'),
  },
  inputButton: {
    flexDirection: 'column',
    alignSelf: 'flex-end'

  },
  button: {
    backgroundColor: 'transparent',
    height: 38,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',

  }
});

module.exports = ChatInput;
