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
var users = new Firebase('https://whoup.firebaseIO.com/usernames');

var FirebaseRef = require('../Api/FirebaseRef');

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
      bottom: "U can't change this",
      current: '',
      step: 'username',
      submitted: false,
      error: false
    }
  },

  submitSignUp: function() {
    this.setState({submitted: true})
    var password = this.state.current;
    var email = this.state.email;
    var username = this.state.username;
    AuthActions.submitSignUp(email, username, password,  function(error) {
      if (error) {
        // TODO: better errors
        alert(error.message);
        var blank = this.getStartState();
        this.setState({submitted: false, ...blank})
      }
    }.bind(this));
  },

  validateEmail: function() {
    if (this.state.step === 'email') {
      var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (re.test(this.state.current) === false){
        this.setState({ error: true })
        return false
      }
      else{
        this.setState({ error: false })
        return true
      }
    }
  },

  updateText: function(event){
    var text = event.nativeEvent.text;
    this.setState({current: text, error: false});


    if (this.state.step === 'username') {
      var text = text.replace(/[\[\].#/]/g, '').toLowerCase();
      if (text !== '' && text.length < 17) {
        FirebaseRef.username(text).once('value', function(snapshot) {
          if (snapshot.val() !== null) {
            this.setState({ error: true })
          } else {
            this.setState({ error: false })
          }
        }.bind(this));
      } else {
        this.setState({error: false})
      }
    }
  },

  onSubmit: function (){
      if (this.state.step === 'username' && !this.state.error) {
        var temp = this.state.current;
        this.refs.container.blur();
        this.setState({current: '', username: temp, step: 'email'})
        this.refs.input.slideOutLeft(500).then((endState) => {this.setState({top: 'Enter a Email'}); this.refs.input.slideInRight(200)});
        this.refs.input2.slideOutLeft(500).then((endState) => {this.setState({bottom: 'So we know u r real'}); this.refs.input2.slideInRight(200)});
      }
      else if (this.state.step === 'email' && this.validateEmail()) {
        var temp = this.state.current;
        this.refs.container.blur();
        this.setState({current: '', email: temp, step: 'password'})
        this.refs.input.slideOutLeft(500).then((endState) => {this.setState({top: 'Enter a Password'}); this.refs.input.slideInRight(200)});
        this.refs.input2.slideOutLeft(500).then((endState) => {this.setState({bottom: ';)', current: ''}); this.refs.input2.slideInRight(200)});
      }
      else if (this.state.step === 'password' && !this.state.error) {
          this.refs.container.blur();
          this.submitSignUp();
      }
  },

  render: function() {
    var button;
    if(this.state.submitted) {
      button = (<View style={styles.button}>
        <ActivityIndicatorIOS color={cssVar('thm2')} />
        </View>)
    }
    else {
      button =
        (
          <TouchableHighlight style={styles.button} onPress={this.onSubmit}>
            <Icon name={'ios-arrow-forward'} size={30} color={'#000000'} style={[styles.next]} />
          </TouchableHighlight>
        )
    };
    return (
      <Image style={styles.container} ref={'container'} source={{uri: 'launch'}}>
        <View style={styles.top}>
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
            secureTextEntry={this.state.step === "password" ? true : false}
            keyboardAppearance={"dark"}
            style={[styles.input, styles.username, this.state.error && styles.error]}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'next'}
            value={this.state.current}
            onChange={this.updateText} //(event) => this.setState({ current: event.nativeEvent.text })}
            onSubmitEditing={(event) => this.onSubmit()}
            />
          <Animatable.View style={{alignItems: 'center', width: SCR_WDTH}} ref={'input2'}>
          <Text style={styles.copy}>
            {this.state.bottom}
          </Text>
          </Animatable.View>
        </View>
        <View style={styles.container}>
          {button}
        </View>
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
  top: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  error: {
    borderWidth: 1,
    borderColor: 'red'
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
