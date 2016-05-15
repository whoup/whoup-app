var React  = require('react-native');
var {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicatorIOS
} = React;


var cssVar = require('../Lib/cssVar');
var Text = require('../Components/Text');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var TextInput  = require('../Components/TextInput');
var Dimensions = require('Dimensions');
var Icon                = require('react-native-vector-icons/Ionicons');
var AppActions          = require('../Actions/AppActions');
var AuthActions          = require('../Actions/AuthActions');

var FirebaseRef = require('../Api/FirebaseRef');


var ChangeEmail = React.createClass({
  getInitialState() {
    return {
      oldEmail: '',
      newEmail: '',
      password: '',
      success: false,
      error: false,
      loading: false
    }
  },

  getUsername: function() {
    return CurrentUserStore.get().data.username;
  },

  getUserId: function() {
    return CurrentUserStore.get().data.id;
  },
  getUserEmail: function() {
    return CurrentUserStore.get().data.email;
  },

  submitChange: function(){
    if(this.state.oldEmail !== '' && this.state.newEmail !== '' && this.state.password !== ''){
      this.setState({loading: true})
      FirebaseRef.ref().changeEmail({
        oldEmail: this.state.oldEmail,
        newEmail: this.state.newEmail,
        password: this.state.password
      }, function(error) {
        if (error) {
          switch (error.code) {
            case "INVALID_PASSWORD":
              this.setState({error: true, errorMessage: "Password is incorrect", loading: false})
              break;
            case "INVALID_USER":
              this.setState({error: true, errorMessage: "Email is incorrect", loading: false})
              break;
            default:
              this.setState({error: true, errorMessage: error.message, loading: false})
          }
        } else {
          AuthActions.updateEmail(this.state.newEmail);
          this.setState({success: true, loading: false});
        }
      }.bind(this));
    }
  },

  statusMessage: function() {
    if (this.state.success) {
      return "You have changed your email!";
    }
    else if (this.state.error) {
      return this.state.errorMessage;
    }
  },

  goBack: function() {
    AppActions.goBack(this.props.navigator);
  },


  renderSubmit: function(){
    if (this.state.loading) {
      return (
        <ActivityIndicatorIOS color={cssVar('thm3')} style={{marginRight: 8}}/>
      )
    } else {
      return (
        <TouchableOpacity onPress={this.submitChange} >
          <Text style={[styles.navBarTextButton]}>
            Save
          </Text>
        </TouchableOpacity>
      )
    }
  },
  renderTitle: function() {
    //var name = this.props.passProps == undefined ? null : this.props.passProps.username
    return (
      <View style={styles.navBar} >
        <TouchableOpacity onPress={this.goBack} >
          <Icon name={'ios-arrow-back'} size={30} color={cssVar('thm3')} style={[styles.imageLIcon]} />
        </TouchableOpacity>
        <Text style={styles.title} >
          Change Email
        </Text>
        {this.renderSubmit()}
      </View>
    );
  },

  render: function() {
    return (
      <View style={styles.flex}>
        {this.renderTitle()}
        <View style={[styles.container]}>
          <Text style={[styles.successMessage, this.state.success && styles.successBox, this.state.error && styles.errorBox]}>
          {this.statusMessage()}
          </Text>
          <TextInput ref="email1"
            placeholder={"Old email"}
            autoCapitalize={"none"}
            autoFocus={true}
            clearButtonMode={'always'}
            autoCorrect={false}
            keyboardType={"email-address"}
            keyboardAppearance={"dark"}
            style={[styles.input, styles.username]}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'next'}
            onChange={(event) => {this.setState({oldEmail: event.nativeEvent.text, error: false }) } }
            onSubmitEditing={(event) => this.refs.email2.refs.input.focus() }
            />
          <TextInput ref="email2"
            placeholder={"New email"}
            autoCapitalize={"none"}
            clearButtonMode={'always'}
            autoCorrect={false}
            keyboardType={"email-address"}
            keyboardAppearance={"dark"}
            style={[styles.input]}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'next'}
            onChange={(event) => {this.setState({newEmail: event.nativeEvent.text, error: false }) } }
            onSubmitEditing={(event) => this.refs.password1.refs.input.focus() }
            />
          <TextInput ref="password1"
            placeholder={'Password'}
            password={true}
            clearButtonMode={'always'}
            autoCorrect={false}
            keyboardType={"default"}
            keyboardAppearance={"dark"}
            style={[styles.input]}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'done'}
            onChange={(event) => {this.setState({password: event.nativeEvent.text, error: false }) } }
            onSubmitEditing={(event) => this.submitChange()}
          />
        </View>

      </View>
    )
  }
});
var SCR_WDTH = Dimensions.get('window').width;

var styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: cssVar('thm5'),
  },
  title: {
    fontSize: 22,
    color: cssVar('thm1'),
    flex: 1,
    textAlign: 'center',
    marginVertical: 9
  },
  imageRIcon: {
    marginRight: 17,
    textAlign: 'right',
    marginTop: -3,
    width: 30,
    height: 30,
  },
  imageLIcon: {
    width: 30,
    height: 30,
    marginLeft: 17,
    marginTop: -3,
    backgroundColor: 'transparent',
  },
  titleView: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: cssVar('thm2')
  },
  successMessage: {
    textAlign: 'center',
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  successBox: {
    color: cssVar('thm3'),
    backgroundColor: 'green',
  },
  errorBox: {
    color: cssVar('thm3'),
    backgroundColor: 'red',
  },
  input: {
    fontFamily: cssVar('fontRegular'),
    fontSize: 18,
    height: 50,
    width: SCR_WDTH,
    borderColor: 'transparent',
    marginBottom: 20,
    backgroundColor: cssVar('thm3')
  },
  error: {
    borderWidth: 1,
    borderColor: 'red'
  },
  navBar: {
    height: 64,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: cssVar('thm2'),
  },
  navBarTextButton: {
    fontSize: 18,
    marginVertical: 8,
    color: cssVar('thm3'),
    fontFamily: cssVar('fontLight'),
    marginRight: 8,
  },

});

module.exports = ChangeEmail;
