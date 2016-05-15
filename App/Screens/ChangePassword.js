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

var FirebaseRef = require('../Api/FirebaseRef');


var ChangeEmail = React.createClass({
  getInitialState() {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      success: false,
      error: false,
      confirmError: false,
      loading: false
    }
  },

  getUserEmail: function() {
    return CurrentUserStore.get().data.email;
  },

  submitChange: function(){
    if(this.state.oldPassword !== '' && this.state.newPassword !== '' && !this.state.confirmError ){
      this.setState({loading: true})
      FirebaseRef.ref().changePassword({
        email: this.getUserEmail(),
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword
      }, function(error) {
        if (error) {
          switch (error.code) {
            case "INVALID_PASSWORD":
              this.setState({error: true, errorMessage: "Current password is incorrect", loading: false})
              break;
            case "INVALID_USER":
              this.setState({error: true, errorMessage: error.message, loading: false})
              break;
            default:
              this.setState({error: true, errorMessage: error.message, loading: false})
          }
        } else {
          this.setState({success: true, loading: false})
        }
      }.bind(this));
    }
  },

  statusMessage: function() {
    if (this.state.success) {
      return "You have changed your password!";
    }
    else if (this.state.error) {
      return this.state.errorMessage;
    }
  },

  goBack: function() {
    AppActions.goBack(this.props.navigator);
  },

  updatePasswordConfirm: function(text){
    if (this.state.newPassword === text) {
      this.setState({newPasswordConfirm: text, confirmError: false })
    } else {
      this.setState({newPasswordConfirm: text, confirmError: true })
    }
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
          Change Password
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
          <TextInput ref="password"
            placeholder={"Old password"}
            autoCapitalize={"none"}
            autoFocus={true}
            clearButtonMode={'always'}
            autoCorrect={false}
            keyboardType={"default"}
            keyboardAppearance={"dark"}
            style={[styles.input, styles.space]}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'next'}
            password={true}
            onChange={(event) => {this.setState({oldPassword: event.nativeEvent.text, error: false }) } }
            onSubmitEditing={(event) => this.refs.password2.refs.input.focus() }
            />
          <TextInput ref="password2"
            placeholder={"New password"}
            autoCapitalize={"none"}
            clearButtonMode={'always'}
            autoCorrect={false}
            keyboardType={"default"}
            keyboardAppearance={"dark"}
            style={[styles.input]}
            enablesReturnKeyAutomatically={true}
            password={true}
            returnKeyType={'next'}
            onChange={(event) => {this.setState({newPassword: event.nativeEvent.text, error: false }) } }
            onSubmitEditing={(event) => this.refs.password3.refs.input.focus() }
            />
          <TextInput ref="password3"
            placeholder={'New password, again'}
            password={true}
            clearButtonMode={'always'}
            autoCorrect={false}
            keyboardType={"default"}
            keyboardAppearance={"dark"}
            style={[styles.input, this.state.confirmError && styles.error]}
            enablesReturnKeyAutomatically={true}
            returnKeyType={'done'}
            onChange={(event) => {this.updatePasswordConfirm(event.nativeEvent.text)} }
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
  space: {
    marginBottom: 40,
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
