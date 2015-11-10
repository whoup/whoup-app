var React = require('react-native');
var {
  View,
  StyleSheet,
  PixelRatio,
  TouchableWithoutFeedback
} = React;

var cssVar = require('../Lib/cssVar');

var AppActions = require('../Actions/AppActions');
var Text       = require('../Components/Text');
var Button     = require('../Components/Button');
var TextInput  = require('../Components/TextInput');

var AuthHelper = {

  // parent implements: onAuthButton, getDefaultProps
  // props: authType (login, signup)

  getInitialState: function() {
    return {
      username: '',
      email: '',
      password: '',
      password_confirm: '',
      chooseUsername: false
    }
  },

  getLinkText: function() {
    switch(this.props.authType) {
      case 'login':
        return 'Not a user? Sign up ';
      case 'signup':
      return 'Already a user? Login ';
      default:
        return '';
    }
  },

  getLinkRoutePath: function() {
    switch(this.props.authType) {
      case 'login':
        return 'signup';
      case 'signup':
        return 'login';
      default:
        return 'signup';
    }
  },

  onLinkButton: function() {
    AppActions.launchRoutePath(this.getLinkRoutePath());
  },

  getButtonText: function() {
    switch(this.props.authType) {
      case 'login':
        return 'Log in';
      case 'signup':
        if (this.state.chooseUsername) {
          return 'Sign Up'
        }
        else {
          return 'Next'
        }
      default:
        return '';
    }
  },

  renderPassword: function() {
    if (this.props.authType === 'login') {
      return (
        <TouchableWithoutFeedback onPress={this.launchForgotPassword}>
          <Text style={[styles.bottomText, styles.forgot]}>Forgot Password?</Text>
        </TouchableWithoutFeedback>
      );
    }
  },

  renderContent: function() {

    return content;
},

  render: function() {
    var singUpField;
    var username;
    var password;
    var title = 'Log In';
    if (this.props.authType === 'signup' && !this.state.chooseUsername) {
      signUpField =
        <TextInput ref="password_confirm"
          placeholder={'Password Confirmation'}
          password={true}
          autoCorrect={false}
          keyboardType="default"
          style={[styles.input, styles.password]}
          enablesReturnKeyAutomatically={true}
          returnKeyType='done'
          onChange={(event) => this.state.password_confirm = event.nativeEvent.text }
          onSubmitEditing={this.onAuthButton}
        />;
      title = 'Sign Up'
    }
    else {
      signUpField = null;
    }
    if (this.state.chooseUsername) {
      username =
      <TextInput ref="username"
          placeholder={"Username"}
          autoCapitalize={"none"}
          keyboardType="email-address"
          style={[styles.input, styles.username]}
          enablesReturnKeyAutomatically={true}
          returnKeyType='next'
          onChange={(event) => this.state.username = event.nativeEvent.text }
          onSubmitEditing={this.onAuthButton}
          />;
      password = <View/>;
      title = 'Choose a Username';
    }
    else {
       username =
        <TextInput ref="email"
          placeholder={"Email"}
          autoCapitalize={"none"}
          keyboardType="email-address"
          style={[styles.input, styles.username]}
          enablesReturnKeyAutomatically={true}
          returnKeyType='next'
          onChange={(event) => this.state.email = event.nativeEvent.text }
          onSubmitEditing={(event) => this.refs.password.focus() }
          />;
        password =
         <TextInput ref="password"
          placeholder={'Password'}
          password={true}
          autoCorrect={false}
          keyboardType="default"
          style={[styles.input, styles.password]}
          enablesReturnKeyAutomatically={true}
          returnKeyType='done'
          onChange={(event) => this.state.password = event.nativeEvent.text }
          onSubmitEditing={this.onAuthButton}
        />
    }

    return (
      <View style={styles.container}>
        <View style={styles.flex} />
        <Text style={[styles.title]}>
          {title}
        </Text>
        {username}
        {password}
        {signUpField}
        <View style={{flex: .2}}/>
        <Button type='blue' onPress={this.onAuthButton} style={styles.button}>
          {this.getButtonText()}
        </Button>
        <View style={styles.flex} />
        <View style={styles.switch}>
          <TouchableWithoutFeedback onPress={this.onLinkButton}>
            <Text style={[styles.switchText, styles.link]}>
              {this.getLinkText()}
              <Text style={[styles.switchText, styles.link, styles.pop]}>
                here
              </Text>
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.flex} />
        <View style={styles.bottom}>
          {this.renderPassword()}
          <View style={styles.flex} />
          <Text style={[styles.bottomText, styles.version]}>TODO: v1</Text>
        </View>
      </View>
    )
  }
};

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cssVar('gray5')//'#FFF',
  },
  username: {
    marginBottom: 10
  },
  password: {
    marginBottom: 10
  },
  title: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: cssVar('gray20'),
    borderRadius: 20,
    fontSize: 13,
    height: 50,
    padding: 10,
    marginHorizontal: 30
  },
  pop: {
    color: cssVar('blue50'),
  },
  bottom: {
    marginTop: 10,
  },
  bottomText: {
    padding: 10,
    color: cssVar('gray20'),
  },
  forgot: {
    textAlign: 'left'
  },
  version: {
    textAlign: 'right'
  },
  switch: {
    alignItems: 'center'
  },
  switchText: {
    fontSize: 16,
  },
});

module.exports = AuthHelper;
