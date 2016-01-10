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


var Login = React.createClass({
  mixins: [KeyboardListener],
  getInitialState: function() {
    return {
      email: '',
      password: '',
      submitted: false
    }
  },

  submit_login: function() {
    this.setState({submitted: true})
    var password = this.state.password;
    var email = this.state.email;
    AuthActions.submitLogin(email, password, function(error) {
      if (error) {
        // TODO: better errors
        alert(error.message);
      }
    });
    // TODO: setState to denote busy
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
      (<TouchableHighlight style={styles.button} onPress={this.submit_login}>
          <Icon name={'ios-arrow-forward'} size={30} color={'#000000'} style={[styles.next]} />
        </TouchableHighlight>)
    };
    return (
      <Image style={styles.container} source={{uri: 'launch'}}>
        <View style={styles.spacer} />
        <View style={styles.center} >
          <Image style={styles.icon} source={require('../Images/owl.png')} />
        </View>
        <TextInput ref="email"
          placeholder={"Email"}
          autoCapitalize={"none"}
          clearButtonMode={'always'}
          keyboardType={"email-address"}
          keyboardAppearance={"dark"}
          style={[styles.input, styles.username]}
          enablesReturnKeyAutomatically={true}
          returnKeyType={'next'}
          onChange={(event) => this.state.email = event.nativeEvent.text }
          onSubmitEditing={(event) => this.refs.password.focus() }
          />
          <TextInput ref="password"
          placeholder={'Password'}
          password={true}
          clearButtonMode={'always'}
          autoCorrect={false}
          keyboardType={"default"}
          keyboardAppearance={"dark"}
          style={[styles.input, styles.password]}
          enablesReturnKeyAutomatically={true}
          returnKeyType={'done'}
          onChange={(event) => this.state.password = event.nativeEvent.text }
          onSubmitEditing={this.submit_login}
        />
        <View style={styles.spacer} />
        {button}
        <View style={{height: this.state.keyboardSpace}}></View>
      </Image>
    )
  }
});

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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    width: 75,
    height: 75,
    marginBottom: 30,
    backgroundColor: 'transparent'
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
    // borderWidth: 1 / PixelRatio.get(),
    // borderColor: cssVar('gray20'),
    // borderRadius: 20,
    fontSize: 18,
    height: 50,
  },
  username: {
    marginBottom: 20,
    backgroundColor: cssVar('thm5')
  },
});

module.exports = Login;
