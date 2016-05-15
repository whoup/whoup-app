// var React = require('react-native');
// var {
//   DatePickerIOS,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } = React;

// var cssVar     = require('../Lib/cssVar');

// var TimeInput = React.createClass({
//   getInitialState: function() {
//     return {
//       editing: false,
//       date: this.props.time,
//       timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
//     };
//   },

//   onDateChange: function(date) {
//     this.setState({date: date});
//     this.props.changeDate(date);
//   },

//   onTimezoneChange: function(event) {
//     var offset = parseInt(event.nativeEvent.text, 10);
//     if (isNaN(offset)) {
//       return;
//     }
//     this.setState({timeZoneOffsetInHours: offset});
//   },

//   render: function() {
//     var datetime;

//     if (this.state.editing) {
//       datetime = (
//                   <TextInput />
//                   );
//     }
//     else {
//       datetime = ( <Text style={styles.text}> {this.state.date.toISOString()}</Text>);
//     }

//     return (
//       <View>
//         {datetime}
//         <DatePickerIOS
//           date={this.state.date}
//           mode="datetime"
//           timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
//           onDateChange={this.onDateChange}
//           minuteInterval={10}
//         />
//       </View>
//     );
//   },
// });


// var styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'black'//cssVar('blue50'),
//   },
//   control: {
//     flex: 1,
//     flexDirection: 'row',
//     borderColor: cssVar('blue50'),
//     borderWidth: 1,
//     borderRadius: 0
//   },
//   flex: {
//     flex: 1
//   },
//   button: {
//     padding: 0,
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedButton: {
//     backgroundColor: 'white',
//   },
//   linkButton: {
//     backgroundColor: cssVar('blue50'),
//   },
//   text: {
//     fontSize: 16
//   },
//   selectedText: {
//     color: cssVar('blue50'),
//   },
//   linkText: {
//     color: 'white'
//   }
// });


// module.exports = TimeInput;
