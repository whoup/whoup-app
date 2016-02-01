// // helper to handle showing lists of things
// // parent must implement methods
// // required: getListItem, getItemProps
// // optional: isListChange, reloadList
// //
// // and give props
// // required: store, currentRoute
// // optional: listProps, segment

// var React = require('react-native');
// var {
//   View,
//   StyleSheet,
//   ActivityIndicatorIOS,
//   InteractionManager,
//   ListView,
//   ProgressViewIOS
// } = React;

// var CurrentUserStore   = require('../Stores/CurrentUserStore');
// var NavigationListener = require('../Mixins/NavigationListener');
// var NavBarHelper       = require('../Mixins/NavBarHelper');

// var Loading          = require('../Screens/Loading');
// var Text             = require('../Components/Text');
// var InvertedList       = require('../Components/InvertedList');
// var AppActions       = require('../Actions/AppActions');

// var ChatInput = require('../Components/ChatInput');


// var ChatHelper = {
//   mixins: [NavigationListener, NavBarHelper],

//   getInitialState: function() {
//     var state = this.getListState();
//     state.renderPlaceHolder = false;
//     return state
//   },

//   getListState: function() {
//     return {
//       items: this.getListItems(),
//       sending: false,
//       progress: null,
//     };
//   },

//   toggleSending: function() {
//     this.setState({sending: (!this.state.sending)})
//   },

//   updateProgress: function(e) {
//     this.setState({progress: e.loaded/e.total})
//   },

//   getNavBarState: function() {
//     //var title = this.state.sending ? 'Sending...' : this.props.passProps.username;
//     //return { title: title };
//   },

//   onListChange: function(arg) {
//     if (!this.isListChange || this.isListChange(arg)) {
//       this.setState(this.getListState());
//     }
//   },

//   _onChange: function() {
//     this.setState(this.getListState());
//   },

//   messageAdded: function() {
//     this.reloadList();
//   },

//   onDidFocusNavigation: function() {
//     // items may have changed
//     this.setState(this.getListState());
//   },

//   componentDidMount: function() {
//     // this.getListState();
//     // InteractionManager.runAfterInteractions(() => {
//     //   this.setState({renderPlaceHolder: false});
//     // });
//     // // Changed from whatever it is in ListHelper, change back if necessary! 10/21/15
//     // this.props.store.addChangeListener(this._onChange);
//     // if (this.reloadList) {
//     //   this.reloadList();
//     // };
//   },

//   componentWillUnmount: function() {

//     // Changed from whatever it is in ListHelper, change back if necessary! 10/21/15
//     //this.props.store.removeChangeListener(this._onChange);
//   },


//   getUsername: function() {
//     if (!this.username) {
//       this.username = this.props.username || CurrentUserStore.get().data.username;
//     }
//     return this.username;
//   },

//   renderProgress: function() {
//     if (this.state.sending) {
//       return (
//         <ProgressViewIOS progress={this.state.progress}/>
//       );
//     }
//     else {
//       return (
//         <View />
//       );
//     }
//   },

//   renderItems: function() {
//     var list;
//     if (this.state.renderPlaceHolder) {
//       list = (
//         <InvertedList
//          style={styles.flex}
//          currentRoute={this.props.currentRoute}
//          getItemProps={this.getItemProps}
//          items={[]}
//          reloadList={this.reloadList}
//          {...this.props.listProps}
//        />
//       );
//     }
//     else {
//       list = (
//        <InvertedList
//          style={[styles.flex, styles.white]}
//          currentRoute={this.props.currentRoute}
//          getItemProps={this.getItemProps}
//          items={[]}
//          reloadList={this.reloadList}
//          {...this.props.listProps}
//        />
//      );
//     }
//     return list;
//   },

//   renderEmpty: function() {
//     return(
//       <View style={styles.container} >
//         <Text style={styles.description}>
//           No Content
//         </Text>
//       </View>
//     );
//   },

//   renderContent: function() {
//     var content = this.renderItems();
//     var progress = this.renderProgress();
//     // if (this.state.items.length === 0) {
//     //   content = this.renderEmpty();
//     // }
//     // else {

//     // }
//     return (
//       <View style={styles.flex}>
//         {progress}
//         {content}
//         <ChatInput toggleSubmitting={this.toggleSending} updateProgress={this.updateProgress}
//           messageAdded={this.messageAdded} roomId={this.props.room_id} />
//       </View>
//     );
//   },

//   render: function() {
//     if (!this.state.items) {
//       // TODO: load error?
//       return this.renderContent();//<Loading />;
//     }
//     else {
//       return this.renderContent();
//     }
//   }
// };

// var styles = StyleSheet.create({
//   flex: {
//     flex: 1
//   },
//   description: {
//     fontSize: 20,
//     textAlign: 'center',
//     justifyContent: 'center',
//     color: '#FFFFFF'
//   },
//   spinner: {
//     height: 40,
//     width: 40,
//   },
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   flex: {
//     flex: 1
//   },
//   white: {
//     backgroundColor: 'white',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     backgroundColor: 'white',
//     padding: 20
//   },
//   button: {
//     // width: 150
//   },
//   footer: {
//     padding: 10,
//     flexDirection: 'row'
//   }
// });

// module.exports = ChatHelper;
