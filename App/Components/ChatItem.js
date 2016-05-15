var React  = require('react-native');
var {
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Linking,
  WebView
} = React;

var cssVar = require('../Lib/cssVar');

var Text       = require('../Components/Text');
var AppActions = require('../Actions/AppActions');
import Hyperlink from 'react-native-hyperlink';



var ChatItem = React.createClass({

  renderTitle: function() {
    if (!this.props.title) return null;

    return (
      <Text style={[styles.title, this.props.received && styles.received]}>
        {this.props.title}
      </Text>
    );
  },

  renderSubtitle: function() {
    if (!this.props.subtitle) return null;

    return (
      <Text style={styles.subtitle}>
        {this.props.subtitle}
      </Text>
    );
  },
  renderContent: function() {
    var multiLine = this.props.body.length > 30;
    var icon1 = this.props.received ? <Image style={styles.icon1} source={{uri: 'owl_y'}} /> : null;
    var icon2 = this.props.received ? null : <Image style={styles.icon2} source={{uri: 'owl_b'}} />;

    var body = this.props.image ?
      <Image style={[styles.image]} defaultSource={{uri: 'app_icon'}} source={{uri: this.props.body}} resizeMode={'contain'}/>
      : <Hyperlink onPress={(url) => Linking.openURL(url).catch(err => console.error('An error occurred', err))}>
      <Text style={[styles.body, this.props.received && styles.received, multiLine && styles.multiLine]}>
          {this.props.body}
        </Text>
        </Hyperlink>
    return (
      <View style={[this.props.noTap && styles.touch]}>
        <View style={styles.left}>
          {icon1}
          {body}
          {icon2}
        </View>
      </View>
    );
  },

  render: function() {
    return (
      <View style={[styles.row, this.props.received && styles.leftAlign]}>

          {this.renderContent()}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  touch: {
    backgroundColor: 'white'
  },
  row: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderColor: 'white'
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
  body: {
    fontSize: 18,
    backgroundColor: cssVar('thm2'),
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'column',
    fontFamily: 'Helvetica',
    color: cssVar('thm1'),
  },
  received: {
    backgroundColor: cssVar('thm1'),
    color: cssVar('thm2'),
  },
  icon1: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  icon2: {
    width: 35,
    height: 35,
    marginLeft: 8,
  },
  subtitle: {
    paddingTop: 5,
    fontSize: 14,
    color: cssVar('gray20'),
  },
  left: {
    flex: 1,
    flexDirection: 'row',
  },
  multiLine: {
    width: 250,
  },
  right: {

  },
  image: {
    width: 300,
    height: 400,

  },
});

module.exports = ChatItem;
