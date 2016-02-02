var React = require('react-native');
var {
  View,
  StyleSheet
} = React;

var TextInput   = require('../Components/TextInput');
var Button      = require('../Components/Button');
var ChatActions = require('../Actions/ChatActions');
var AppActions  = require('../Actions/AppActions');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var cssVar = require('../Lib/cssVar');
var KeyboardListener = require('../Mixins/KeyboardListener');

var Rebase = require('re-base');
var base = Rebase.createClass('https://whoup.firebaseio.com/');

var Firebase = require('firebase');
var ChatInput = React.createClass({
  mixins: [KeyboardListener],

  getInitialState: function() {
    return this.blankContent();
  },

  blankContent: function() {
    return {
      body: '',
      height: 0,
    };
  },

  updateText: function(text) {
    this.setState({content: {
      body: text,
    }});
  },
  clearText: function() {
    this.setState(this.blankContent);
  },

  toggleSubmitting: function() {
    this.setState({submitting: (!this.state.submitting)})
  },

  onSubmitButton: function() {
    if (!this.state.submitting) {
      postEnd = 'users/' + this.props.friendId + '/messages/' + this.props.currUid;
      currUsrEnd = 'users/' + this.props.currUid + '/messages/' + this.props.friendId;
      this.props.toggleSubmitting();
      this.toggleSubmitting();
      body = this.state.body;
      this.clearText();
      toggleSub = this.toggleSubmitting;
      togglePropSub = this.props.toggleSubmitting;
      base.push(postEnd, {
        data: {body: body, received: true, timestamp: Firebase.ServerValue.TIMESTAMP},
        then(){
          base.push(currUsrEnd, {
            data: {body: body, received: false, timestamp: Firebase.ServerValue.TIMESTAMP},
            then(){
                toggleSub();
                togglePropSub();
            }
          })
        }
      });
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput ref={"message"}
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
                this.setState({
                  body: event.nativeEvent.text,
                  height: event.nativeEvent.contentSize.height,
                });
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
