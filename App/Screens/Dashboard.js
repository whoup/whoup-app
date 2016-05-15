var React = require('react-native');
var {
  View,
  StyleSheet,
  ListView,
  Image,
} = React;

var CurrentUserStore   = require('../Stores/CurrentUserStore');
var NavigationListener = require('../Mixins/NavigationListener');
var NavBarHelper       = require('../Mixins/NavBarHelper');
var Loading          = require('../Screens/Loading');
var Text             = require('../Components/Text');
var AnimatedImage    = require('../Components/AnimatedImage');
var Button     = require('../Components/Button');
var SectionedList       = require('../Components/SectionedList');
var AppActions       = require('../Actions/AppActions');
var cssVar = require('../Lib/cssVar');
var FriendActions = require('../Actions/FriendActions');
var ChatActions = require('../Actions/ChatActions');
var TimerMixin = require('react-timer-mixin');
var Rebase = require('re-base');
var FirebaseRef = require('../Api/FirebaseRef');
var Animatable = require('react-native-animatable');
var client = require('../Api/HTTPClient')
var base = Rebase.createClass('https://whoup.firebaseio.com/');


var ChatRoomList = React.createClass({
  mixins: [TimerMixin],

  getInitialState: function() {
    return {
              users: [],
              up: {},
              userIsUp: false,
              //bounceValue: new Animated.Value(0),

          }
  },

  getDefaultProps: function() {
    return {
      listProps: {
        nextIcon: true
      },
    };
  },

  getItemProps: function(friend) {
    return {
      name: friend.username,
      type: 'dashboardFriend',
      id: friend.key,
      up: this.isUserUp(this.state.up[friend.key]),
      subPath: friend.key,
      passProps: {
        id: friend.key,
        username: friend.username
      }
    }
  },

  imUp: function() {
    FirebaseRef.goOnline(this.getUserId());
    this.setState({userIsUp: true});
    var animate = () => this.refs.ico.bounce(1200);
    this.setInterval(animate, 10000);
    animate();
  },


  setUpNotUpTimers: function() {
    var now = new Date();
    var sixAm = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          6,0,0);
    var sixAmTomorrow = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          6,0,0);
    var ninePM = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          21,0,0);
    if (now < sixAm) {
      this.setTimeout(
        () => { AppActions.launchRoutePath('whoup/dashboard'); },
        (sixAm.getTime() - now.getTime())
      );
    } else if (now > ninePM) {
      this.setTimeout(
        () => { AppActions.launchRoutePath('whoup/dashboard'); },
        (sixAmTomorrow.getTime() - now.getTime())
      );
    }
    else if (now > sixAm && now < ninePM){
      this.setTimeout(
        () => { AppActions.launchRoutePath('whoup/dashboard'); },
        (ninePM.getTime() - now.getTime())
      );
    }
  },

  componentDidMount: function() {
    var id = this.getUserId();
    this.setUpNotUpTimers();
    this.ref = base.bindToState('users/' + id + '/friends', {
      context: this,
      state: 'users',
      asArray: true
    });
    this.ups = base.bindToState('presence', {
      context: this,
      state: 'up',
      asArray: false,
    });

  },

  componentWillUnmount: function() {
    base.removeBinding(this.ref);
    base.removeBinding(this.ups);
  },

  isUserUp: function(user){
    var F_MIN = 15 * 60 * 1000;
    return (user !== undefined && ( user.began !== undefined || new Date() - new Date(user.ended) < F_MIN ));
  },

  sortUsers: function(){
    var up = [];
    var notUp = [];
    var user;
    for (var i in this.state.users) {
      user = this.state.users[i]
      if (this.isUserUp(this.state.up[user.key])) {
        up.push(user)
      }
      else {
        notUp.push(user);
      }
    };
    if (up.length === 0){
      up = notUp;
      return { up: notUp };
    }
    else
      return { up: up, notUp: notUp };
  },

  getUsername: function() {
    if (!this.username) {
      this.username = this.props.username || CurrentUserStore.get().data.username;
    }
    return this.username;
  },
  getUserId: function() {
    return CurrentUserStore.get().data.id;
  },



  renderItems: function() {
    return (
    <View style={styles.marLeftRight}>
      <SectionedList
        style={styles.flex}
        currentRoute={this.props.currentRoute}
        getItemProps={this.getItemProps}
        items={this.sortUsers()}
        {...this.props.listProps}
      />
      </View>
    );
  },

  renderEmpty: function() {
    return(
      <View style={styles.container} >
        <Text style={styles.description}>
          No Content
        </Text>
      </View>
    );
  },
  renderContent: function() {
    var content = this.renderItems();
        return (
          <Image style={[styles.flex,]} source={{uri: 'black'}}>
            <View style={[styles.center, styles.qflex, styles.copyOffset, styles.black, styles.paddTop]}>
              <Animatable.Image
                ref="ico"
                style={[styles.icon]}
                source={{uri: 'owl'}} />
                <Text style={styles.copy}>
                  Who Up?
                </Text>
              </View>
            {content}
          </Image>
          );

  },

  renderNotTime: function() {
    //<Image style={[styles.notTime]} source={{uri: 'not_time'}}/>
    return (
    <Image style={[styles.container]} source={{uri: 'white'}}>
      <AnimatedImage
        style={styles.notTimeIcon}
        resizeMode={'stretch'}
        tap={true}
        active={'bored.gif'}
        inactive={'bored_owl'}
        />
      <Text style={[styles.notTimeText]}>
        It's not quite time yet,
      </Text>
      <Text style={[styles.notTimeText]}>
        come back in the evening
      </Text>

    </Image>)
  },

  renderList: function() {

      if (this.state.users === null) {
        return (<View style={[styles.flex, styles.container]}>
                  <Text style={[styles.description]}>
                   { "No Friends :(" }
                  </Text>
                </View>
                );
      }
      else if (this.state.users == null) {
        return <Loading />;
      }
      else {
        return this.renderContent();
      }

  },

  renderYouUp: function() {
    return (<Image style={[styles.flex, styles.paddTop]} source={{uri: 'black'}}>
            <View style={[styles.flex, styles.container, styles.offsetBottom]}>
              <AnimatedImage
                style={styles.logo}
                resizeMode={'contain'}
                active={'sleepy.gif'}
                inactive={'sleepy_owl'}
                />
                  <Text style={[styles.question]}>
                    {'You Up?'}
                  </Text>
                  <Button onPress={this.imUp} style={styles.button}>
                      {'YES'}
                  </Button>
                </View>
                </Image>
            );
  },

  render: function() {
    //this.state.up[this.getUserId()] !== undefined && this.state.up[this.getUserId()].began !== undefined
    var content;
    if (this.props.currentRoute.passProps.itsTime) {
      if (this.state.userIsUp) {
        content = this.renderList();
      } else {
        content = this.renderYouUp();
      }
      return content;
    }
    else {
      return this.renderNotTime();
    }
  }
});

var styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  paddTop: {
    paddingTop: 64
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: cssVar('thm1')
  },
  black: {
    backgroundColor: cssVar('thm2')
  },
  notTime: {
    width: 300,
    height: 83
  },
  question: {
    fontSize: 35,
    paddingBottom: 10,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  button: {
    width: 150,
    backgroundColor: cssVar('thm1'),
  },
  offsetBottom: {
    paddingBottom: 150
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    height: 200,
    width: 100,
    backgroundColor: 'transparent',
  },
  copy: {
    backgroundColor: 'transparent',
    fontSize: 40,
    color: cssVar('thm3')
  },
  icon: {
    width: 75,
    height: 75,
    backgroundColor: 'transparent',
  },
  notTimeIcon: {
    width: 150,
    height: 150,
    backgroundColor: 'transparent',
    marginTop: -64,
    marginBottom: -20
  },
  notTimeText: {
    fontSize: 30,
    textAlign: 'center',
    color: cssVar('thm2')
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  qflex: {
    flex: 0.25
  },
  marLeftRight: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  copyOffset: {
    paddingBottom: 20
  }
});

module.exports = ChatRoomList;
