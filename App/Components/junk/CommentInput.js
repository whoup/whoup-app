var React = require('react-native');
var {
  View,
  StyleSheet
} = React;

var TextInput   = require('../Components/TextInput');
var Button      = require('../Components/Button');
var PostActions = require('../Actions/PostActions');
var AppActions  = require('../Actions/AppActions');
var CurrentUserStore = require('../Stores/CurrentUserStore');

var KeyboardListener = require('../Mixins/KeyboardListener');

var CommentInput = React.createClass({
  mixins: [KeyboardListener],

  getInitialState: function() {
    return this.blankContent();
  },

  blankContent: function() {
    return {
      text: '',
      submitting: false
    };
  },

  updateText: function(text) {
    this.setState({text: text});
  },
  clearText: function() {
    this.setState(this.blankContent);
  },

  toggleSubmitting: function() {
    this.setState({submitting: (!this.state.submitting)})
  },

  getSendData: function() {
    data = {};
    data.text = this.state.text
    if (this.props.type === 'activity') {
      data.activity_log_id = this.props.logId
    }
    else {
      data.food_log_id = this.props.logId
    }
    return data;

  },

  onSubmitButton: function() {
    if (!this.state.submitting) {
      this.props.toggleSubmitting();
      this.toggleSubmitting();

      var data = {};
      data.params = this.getSendData();
      data.logId = this.props.logId;
      data.type = this.props.logType;
      this.clearText();

      //Comment Actions!!
      PostActions.createLogComment(data, function(e) {
        this.props.updateProgress(e);
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
        }
        AppActions.goBack(this.props.navigator);
      }.bind(this));

    };
  },

  render: function() {
    return (
      <View>
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput ref="message"
            placeholder={"Add a Message..."}
            keyboardType="default"
            multiline={true}
            clearTextOnFocus={true}
            autoGrow={true}
            autoFocus={false}
            style={styles.input}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'send'}
            onChangeText={this.updateText}
            value={this.state.text}
            />
          </View>
          <View style={[styles.inputButton]} />
          <Button type='blue' style={styles.button} disabled={this.state.submitting} onPress={this.onSubmitButton}>
            send
          </Button>
        </View>
        <View style={{height: this.state.keyboardSpace}}></View>
      </View>    );
  }
});

var styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    fontSize: 14,
    height: 50,
    borderRadius: 10,
    flexDirection: 'column',
  },
  inputContainer: {
    flex: 1,
  },
  inputButton: {

  },
  button: {
  },
  footer: {
    padding: 10,
    flexDirection: 'row'
  }
});

module.exports = CommentInput;
