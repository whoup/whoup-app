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
//var FirebaseRef = require('../Api/FirebaseRef');
var Dimensions = require('Dimensions');
var Login = React.createClass({
  mixins: [KeyboardListener],
  getInitialState: function() {
    return {
      email: '',
      password: '',
      submitted: false,
      error: false
    }
  },



  submitLogin: function() {
    this.setState({submitted: true})
    var password = this.state.password;
    var email = this.state.email;
    AuthActions.submitLogin(email, password, function(error, data) {
      if (error) {
        // TODO: better errors
        this.setState({submitted: false, error: true})
      }
    }.bind(this));
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
      (<TouchableHighlight style={styles.button} onPress={this.submitLogin}>
          <Icon name={'ios-arrow-forward'} size={30} color={'#000000'} style={[styles.next]} />
        </TouchableHighlight>)
    };
    return (
      <Image style={styles.container} source={{uri: 'launch'}}>
      <View style={styles.top} >
        <View style={styles.center} >
          <Image style={styles.icon} source={{uri: 'owl'}} />
        </View>
        <TextInput ref="email"
          placeholder={"Email"}
          autoCapitalize={"none"}
          clearButtonMode={'always'}
          autoCorrect={false}
          keyboardType={"email-address"}
          keyboardAppearance={"dark"}
          style={[styles.input, styles.username, this.state.error && styles.error]}
          enablesReturnKeyAutomatically={true}
          returnKeyType={'next'}
          onChange={(event) => {this.setState({email: event.nativeEvent.text, error: false }) } }
          onSubmitEditing={(event) => this.refs.password.refs.input.focus() }
          />
        <TextInput ref="password"
          placeholder={'Password'}
          password={true}
          clearButtonMode={'always'}
          autoCorrect={false}
          keyboardType={"default"}
          keyboardAppearance={"dark"}
          style={[styles.input, styles.password, this.state.error && styles.error]}
          enablesReturnKeyAutomatically={true}
          returnKeyType={'done'}
          onChange={(event) => {this.setState({password: event.nativeEvent.text, error: false }) } }
          onSubmitEditing={(event) => this.submitLogin()}
        />
      </View>
        <View style={[styles.bottom, (this.state.keyboardSpace < 10) && styles.halfFlex]} >
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
    justifyContent: 'center',
  },
  bottom: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  halfFlex: {
    flex: 0.5,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: cssVar('thm1'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    width: 75,
    height: 75,
    backgroundColor: 'transparent',
  },
  // spacer: {
  //   flex: 1
  // },
  login: {
    backgroundColor: cssVar('thm4'),
    borderBottomWidth: 5,
  },
  signup: {
    backgroundColor: cssVar('thm1'),
  },
  error: {
    borderWidth: 1,
    borderColor: 'red'
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
    fontSize: 18,
    height: 50,
    width: SCR_WDTH,
    borderColor: 'transparent'
  },
  username: {
    marginBottom: 20,
    backgroundColor: cssVar('thm5')
  },
  password: {
    marginBottom: 20,
    backgroundColor: cssVar('thm5')
  },
});

module.exports = Login;
