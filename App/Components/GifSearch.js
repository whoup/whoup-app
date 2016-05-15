var React = require('react-native');
var {
  View,
  ListView,
  Image,
  StyleSheet
}
var client = require('../Api/HTTPClient')

var GifSearch = React.createClass({

  render: function() {
    if (this.props.hidden) {
      return <View/>
    }

    return (
      <ListView
      items={this.state.items}
      style={[styles.list]} horizontal={true}  />
    )
  }

});

var styles = StyleSheet.create({
  list: {
    height: 100,

  },

})

