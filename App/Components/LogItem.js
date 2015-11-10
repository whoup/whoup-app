var React  = require('react-native');
var {
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  ScrollView,
  Image
} = React;

var cssVar = require('../Lib/cssVar');
var CurrentUserStore = require('../Stores/CurrentUserStore');


var Text       = require('../Components/Text');
var Icon = require('react-native-vector-icons/Ionicons');
var AppActions = require('../Actions/AppActions');
var CommentItem = require('../Components/CommentItem');


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


var LogItem = React.createClass({

  onSelection: function() {
    AppActions.launchRelativeItem(this.props.currentRoute, this.props);
  },

  capitalize: function(word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  },

  parseTime: function(time) {
    date = new Date(time);
    hours = date.getHours();
    minutes = date.getMinutes();
    var suffix = hours >= 12 ? "PM":"AM";
    hours = ((hours + 11) % 12 + 1);

    return  (hours + ':' + minutes + ' ' + suffix);
  },

  _shareHandler: function() {
    ActivityView.show({
      text: this.props.description,
      url: this.props.share_url,
      imageUrl: this.props.image.url,
    });
  },
  _commentHandler: function() {
    AppActions.launchRelativeItem(this.props.currentRoute, this.props);
  },
  renderHeader: function() {
    var type = this.props.type
    if (!type) return null;
    type = this.capitalize(type);

    time = this.parseTime(this.props.time);

    return (
      <View style={[styles.inline, styles.underline]}>
        <Text style={[styles.type, styles.left]}>
          {type}
        </Text>
        <Text style={[styles.time, styles.right]}>
          {time}
        </Text>
      </View>
    );
  },

  renderImage: function() {
    var imgurl = this.props.type === 'food' ? this.props.image.url : '';
    //if (!this.props.subtitle) return null;
    // TODO: set defaultSource {uri: string} (local file to display in meantime)
    return (
      <View style={styles.imageContainer}>
        <View style={{flexDirection: 'row'}}>
          <Lightbox style={styles.lightBox} navigator={this.props.navigator}>
            <Image style={styles.image}
                      source = {{uri: imgurl}}>
              <View style={styles.backdropView}>
                <Text style={styles.activityName}>{this.props.name}</Text>
                <Text style={styles.activityIntensity}>{this.props.intensity}</Text>
              </View>
            </Image>
          </Lightbox>
        </View>
      </View>
    );
  },

  renderActions: function() {
    var heartColor = this.props.heart ? cssVar('heartActive') : cssVar('gray10');
    return (
      <View>
        <View style={[styles.inline, styles.underline, styles.overline]}>
          <View style={[styles.left, styles.inline]}>
            <Icon name="ios-heart" size={40} color={heartColor} />

            <View style= {styles.spacer}/>
            <TouchableOpacity onPress={this._commentHandler} activeOpacity={0.1}>
              <Icon name="ios-chatbubble-outline" size={40} color={cssVar('gray30')} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={this._shareHandler} style={[styles.right]} activeOpacity={0.1}>
            <Icon name="ios-upload-outline" size={40} color={cssVar('gray30')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  renderDescription: function() {
    return (
      <View>
        <Text style={[styles.comment]}>
          <Text style={styles.commentor}>
            {CurrentUserStore.get().data.username + ' '}
          </Text>
          {this.props.description}
        </Text>
      </View>
    )

  },

  renderCommentRow: function(item, sectionId, rowId) {

    return (
      <CommentItem {...item} key={'item'+ (item.id || rowId)}/>
    )
  },

  renderComments: function() {
    return (
      <ListView
        automaticallyAdjustContentInsets={true}
        dataSource={ds.cloneWithRows(this.props.comments)}
        renderRow={this.renderCommentRow}
        bounces={false}
        scrollEnabled={false}
      />
    );

  },
  renderContent: function() {
    return (
      <View style={[styles.row, this.props.noTap && styles.touch]}>
        <View style={styles.left}>
          {this.renderHeader()}
          {this.renderImage()}
          {this.renderActions()}
          {this.renderDescription()}
          {this.renderComments()}
        </View>
      </View>
    );
  },

  render: function() {
    if (this.props.noTap) {
      return this.renderContent();
    }

    return (
      <View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding:20,
  },
  backdropView: {
    height: 120,
    width: 320,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  activityName: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  activityIntensity: {
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  inline: {
    flexDirection: 'row',
  },
  type: {
    fontSize: 14,
    fontWeight: '800',
  },
  time: {
    color: cssVar('gray30'),
    fontSize: 14,
  },
  title: {
    flex: 1,
    fontSize: 18,
  },
  commentor: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  comment: {
    fontSize: 18,
    textAlign: 'justify'
  },
  subtitle: {
    paddingTop: 5,
    fontSize: 14,
    color: cssVar('gray20'),
  },
  left: {
    flex: 1,
  },
  right: {

  },
  spacer: {
    width: 10,
  },
  lightBox: {
    alignItems: 'center'
  },
  image: {
    // width: 335,
     height: 335
  },
  underline: {
    borderBottomWidth: 0.5,
    borderBottomColor: cssVar('gray10'),
  },
  overline: {
    borderTopWidth: 0.5,
    borderTopColor: cssVar('gray10'),
  },
  imageContainer: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  rightIcon: {
    fontFamily: cssVar('fontIcon'),
    color: cssVar('gray30'),
    fontSize: 12,
  }
});

module.exports = LogItem;
