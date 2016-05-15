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
var AppActions = require('../Actions/AppActions');
var cssVar = require('../Lib/cssVar');
var Text = require('../Components/Text');
//var FirebaseRef = require('../Api/FirebaseRef');
var Dimensions = require('Dimensions');
var Login = React.createClass({
  mixins: [KeyboardListener],

  getInitialState: function() {
    return {
      email: '',
      submitted: false,
      error: false,
      message: ''
    }
  },

  submitReset: function() {
    this.setState({submitted: true})
    var email = this.state.email;
    AuthActions.resetPassword(email, function(error) {
      if (error) {
        // TODO: better errors
        this.setState({submitted: false, error: true, message: error.message})
      } else {
        this.setState({submitted: false, message: "check yo email for instructions"})
      }
    }.bind(this));
  },

  goBack: function() {
    AppActions.goBack(this.props.navigator);
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
      (<TouchableHighlight style={styles.button} onPress={this.submitReset}>
          <Icon name={'ios-arrow-forward'} size={30} color={'#000000'} style={[styles.next]} />
        </TouchableHighlight>)
    };
    return (
      <Image style={styles.container} source={{uri: 'launch'}}>
        <View style={styles.top} >
          <View style={styles.center} >
            <Image style={styles.icon} source={{uri: 'owl'}} />
          </View>
          <Text style={[styles.forgot_password,
            this.state.error && styles.errorMessage]}>
            {this.state.message}
          </Text>
          <TextInput
            ref={"email"}
            placeholder={"Email"}
            autoCapitalize={"none"}
            clearButtonMode={'always'}
            autoCorrect={false}
            keyboardType={"email-address"}
            keyboardAppearance={"dark"}
            style={[styles.input, styles.username, this.state.error && styles.error]}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'default'}
            onChange={(event) => {this.setState({email: event.nativeEvent.text, error: false })}}
            onSubmitEditing={(event) => this.submitReset()}
            />
        </View>
        <View style={[styles.bottom, (this.state.keyboardSpace < 10) && styles.halfFlex]} >
          {button}
          <Text onPress={this.goBack} style={[styles.forgot_password]}>Login</Text>
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
    borderColor: 'red',
  },
  errorMessage: {
    color: 'red'
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
  forgot_password: {
    marginTop: 15,
    marginBottom: 5,
    color: cssVar('thm1'),
    fontSize: 16,
    alignSelf: 'center',

  },
});

module.exports = Login;
