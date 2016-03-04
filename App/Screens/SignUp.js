var React  = require('react-native');
var {
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS,
  PixelRatio
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var KeyboardListener = require('../Mixins/KeyboardListener');
var TextInput  = require('../Components/TextInput');
var AuthActions = require('../Actions/AuthActions');
var cssVar = require('../Lib/cssVar');
var Text = require('../Components/Text');

var Animatable = require('react-native-animatable');
var Dimensions = require('Dimensions');


var SignUp = React.createClass({
  mixins: [KeyboardListener],
  getInitialState: function() {
    return this.getStartState();
  },

  getStartState: function(){
     return {
      username: '',
      email: '',
      password: '',
      top: 'Enter a Username',
      bottom: 'U can\'t change this',
      current: '',
      step: 'username',
      submitted: false
    }
  },

  submitSignUp: function(password, email, username) {
    this.setState({submitted: true})
    // var password = this.state.password;
    // var email = this.state.email;
    // var username = this.state.username;
    AuthActions.submitSignUp(email, username, password,  function(error) {
      if (error) {
        // TODO: better errors
        alert(error.message);
        var blank = this.getStartState();
        this.setState({submitted: false, ...blank})
      }
    }.bind(this));
  },

  onSubmit: function (){
    if (this.state.step === 'username') {
      var temp = this.state.current;
      this.refs.container.blur();
      this.setState({current: '', username: temp, step: 'email'})
      this.refs.input.slideOutLeft(500).then((endState) => {this.setState({top: 'Enter a Email'}); this.refs.input.slideInRight(200)});
      this.refs.input2.slideOutLeft(500).then((endState) => {this.setState({bottom: 'So we know u r real'}); this.refs.input2.slideInRight(200)});
    }
    else if (this.state.step === 'email') {
      var temp = this.state.current;
        this.refs.container.blur();
        this.setState({current: '', email: temp, step: 'password'})
        this.refs.input.slideOutLeft(500).then((endState) => {this.setState({top: 'Enter a Password'}); this.refs.input.slideInRight(200)});
        this.refs.input2.slideOutLeft(500).then((endState) => {this.setState({bottom: ';)', current: ''}); this.refs.input2.slideInRight(200)});
    }
    else if (this.state.step === 'password') {
     //  // AuthActions.signUp(this.state.email, this.state.password, this.state.username, (error) => {
     //  //   if (error) {
     //  //     this.setState.
     //  //   }
     // // });
     // this.submitSignUp();
     //  //this.setState({current: '', step: 'username', submitted: true});


      //var temp = this.state.current;
        this.refs.container.blur();
        //this.setState({current: '', password: temp})
        this.submitSignUp(this.state.current, this.state.email, this.state.username);

        //this.refs.input.slideOutLeft(500).then((endState) => {this.setState({top: 'One more time'}); this.refs.input.slideInRight(200)});
        //this.refs.input2.slideOutLeft(500).then((endState) => {this.setState({bottom: '', }); this.refs.input2.slideInRight(200)});
    }
    // else if (this.state.step === 'password_confrim') {
    //   var temp = this.state.current;
    //     this.refs.container.blur();
    //     console.loc(this.state.email, this.state.username, this.state.password, this.state.password_confrim)
    //     // this.setState({current: 'email', email: temp, step: 'password'})
    //     // this.refs.input.slideOutLeft(500).then((endState) => {this.setState({top: 'Enter a Password'}); this.refs.input.slideInRight(200)});
    //     // this.refs.input2.slideOutLeft(500).then((endState) => {this.setState({bottom: ''}); this.refs.input2.slideInRight(200)});
    // }
  },

  render: function() {
    var button;
    if(this.state.submitted) {
      button = (<View style={styles.button}>
        <ActivityIndicatorIOS color={cssVar('thm2')} />
        </View>)
    }
    // else if (this.state.current === 'passwordConfirm') {
    //  button=
    //   (<TouchableHighlight style={styles.button} onPress={this.onSubmit}>
    //       <Icon name={'ios-arrow-forward'} size={30} color={'#000000'} style={[styles.next]} />
    //     </TouchableHighlight>)
    // }
    else {
      button =
      (<TouchableHighlight style={styles.button} onPress={this.onSubmit}>
          <Icon name={'ios-arrow-forward'} size={30} color={'#000000'} style={[styles.next]} />
        </TouchableHighlight>)
    };
    return (
      <Image style={styles.container} ref={'container'} source={{uri: 'launch'}}>
        <View style={styles.spacer} />
          <Animatable.View style={{alignItems: 'center', width: SCR_WDTH}} ref={'input'}>
          <Text style={styles.copy}>
            {this.state.top}
          </Text>
          </Animatable.View>
          <TextInput
            ref={'inputField'}
            autoCapitalize={"none"}
            clearButtonMode={'always'}
            autoCorrect={false}
            keyboardType={"email-address"}
            keyboardAppearance={"dark"}
            style={[styles.input, styles.username]}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'next'}
            value={this.state.current}
            onChange={(event) => this.setState({ current: event.nativeEvent.text })}
            onSubmitEditing={(event) => this.onSubmit()}
            />
          <Animatable.View style={{alignItems: 'center', width: SCR_WDTH}} ref={'input2'}>
          <Text style={styles.copy}>
            {this.state.bottom}
          </Text>
          </Animatable.View>
        <View style={styles.spacer} />
        {button}
        <View style={{height: this.state.keyboardSpace}}></View>
      </Image>
    )
  }
});
var SCR_WDTH = Dimensions.get('window').width;
var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    //backgroundColor: cssVar('thm5'),
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: cssVar('thm1'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inputContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  copy: {
    color: cssVar('thm3'),
    fontSize: 18,
    paddingTop: 5,
    paddingBottom: 5,
  },
  spacer: {
    flex: 1
  },
  login: {
    backgroundColor: cssVar('thm4'),
    borderBottomWidth: 5,
  },
  signup: {
    backgroundColor: cssVar('thm1'),
  },
  buttonStyle: {
    flex: 0.25,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: cssVar('thm2'),
    fontSize: 18,
  },
  input: {
    fontFamily: cssVar('fontRegular'),
    textAlign: 'center',
    alignSelf: 'stretch',
    fontSize: 18,
    height: 50,
    width: SCR_WDTH,
    backgroundColor: cssVar('thm1'),
  },
});

module.exports = SignUp;
