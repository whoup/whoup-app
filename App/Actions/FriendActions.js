var FirebaseRef      = require('../Api/FirebaseRef');
var UserService = require('../Api/UserService');
var Network = require('../Api/Network');

var FriendActions = {
  // fetchList: function(uid, callback) {
  //   Network.started();
  //   UserService.watchFriendList(CURRENT_USER.id, function(error, listProps) {
  //     Network.completed();
  //     if(callback) callback(error);

  //     if (!error) {
  //       Dispatcher.dispatch({
  //         actionType: AppConstants.FRIEND_LIST_UPDATED,
  //         listProps: listProps
  //       });
  //     }
  //   });
  // },
  // fetchRequestList: function(uid, callback) {
  //   Network.started();
  //   UserService.watchRequestList(CURRENT_USER.id, function(error, listProps) {
  //     Network.completed();
  //     if(callback) callback(error);
  //     if (!error) {
  //       Dispatcher.dispatch({
  //         actionType: AppConstants.FRIENDREQ_LIST_UPDATED,
  //         listProps: listProps
  //       });
  //     }
  //   });
  // },

  // unmountFriendAdd: function() {
  //   FirebaseRef.userFriendRef(CURRENT_USER.id).off('child_added', function(snapshot, prevKey) {
  //     var newFriend = snapshot.val();
  //     var data = {
  //       key: 'friend',
  //       friendProps: {
  //         id: newFriend.id,
  //         username: newFriend.username,
  //       }
  //     };
  //       Dispatcher.dispatch({
  //         actionType: AppConstants.FRIEND_ADDED,
  //         friendProps: data
  //       });
  //   })
  // },

  // mountFriendAdd: function() {
  //   FirebaseRef.userFriendRef(CURRENT_USER.id).on('child_added', function(snapshot, prevKey) {
  //     var newFriend = snapshot.val();
  //     var data = {
  //       key: 'friend',
  //       friendProps: {
  //         id: newFriend.id,
  //         username: newFriend.username,
  //       }
  //     };
  //       Dispatcher.dispatch({
  //         actionType: AppConstants.FRIEND_ADDED,
  //         friendProps: data
  //       });
  //   })
  // },
  // unmountFriendReq: function() {
  //   FirebaseRef.userFriendReqRef(CURRENT_USER.id).off('child_added', function(snapshot, prevKey){
  //     var newReq = snapshot.val();
  //     var data = {
  //       key: 'request',
  //       friendProps: {
  //         id: newReq.id,
  //         username: newReq.username,
  //       }
  //     };
  //      Dispatcher.dispatch({
  //         actionType: AppConstants.FRIENDREQ_ADDED,
  //         friendProps: data
  //       });
  //   });
  // },
  // mountFriendReq: function() {
  //   FirebaseRef.userFriendReqRef(CURRENT_USER.id).on('child_added', function(snapshot, prevKey){
  //     var newReq = snapshot.val();
  //     var data = {
  //       key: 'request',
  //       friendProps: {
  //         id: newReq.id,
  //         username: newReq.username,
  //       }
  //     };
  //      Dispatcher.dispatch({
  //         actionType: AppConstants.FRIENDREQ_ADDED,
  //         friendProps: data
  //       });
  //   });
  // },

  addFriend: function(uid, username, currUid, currUsername, callback) {
    Network.started();
    FirebaseRef.userFriendReqRef(uid).child(currUid).transaction(function(currentData) {
      if (currentData === null) {
        return {username: currUsername};
      } else {

      return callback({message: "Request already sent"}); // Abort the transaction.
    }
    }, function(error, committed, snapshot) {
      if (error) {
        console.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        console.log('We aborted the transaction (because wilma already exists).');
      } else {
        FirebaseRef.userRef(currUid).child('sent_reqs').child(uid).set({username: username})
        FirebaseRef.pushRef().push({
              type: 'request',
              to: uid,
              from: currUid,
              message: '@' + currUsername + ' sent you a friend request',
              username: currUsername
            })
        Network.completed();
        callback();
      }
    });
  },

  deleteFriend: function(uid, currUid, callback) {
    Network.started();
    FirebaseRef.userFriendRef(uid).child(currUid).remove(function(error) {
      if (error) {
        callback(error);
        Network.completed()
      } else {
        FirebaseRef.userFriendRef(currUid).child(uid).remove(function(error) {
          callback(error);
          Network.completed()
        });
      }
    })
  },

  acceptRequest: function(uid, username, currUid, currUsername, callback) {
    Network.started();
    FirebaseRef.userFriendRef(uid).child(currUid).transaction(function(currentData) {
        if (currentData === null) {
          var data = {};
          data.username = currUsername;
          return data;
        } else {
          return callback({message: "Friend already added"})
        }
    }, function(error, committed, snapshot) {
       if (error) {
        // todo: error callback
        console.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        // todo: error callback
        console.log('We aborted the transaction.');
      } else {
        FirebaseRef.userFriendRef(currUid).child(uid).set({username: username})
      }
    });
    FirebaseRef.userRef(uid).child('sent_reqs').child(currUid).remove(function(error) {
        if (error) {
          callback({message: "Friend already accepted"})
        } else {
          FirebaseRef.userFriendReqRef(currUid).child(uid).remove(function(error) {
            FirebaseRef.pushRef().push({
              type: 'request-accept',
              to: uid,
              from: currUid,
              message: '@' + currUsername + ' accepted your friend request',
              username: currUsername
            })
            Network.completed();
            return callback();
          });
        }
    });

  },


};

module.exports = FriendActions;
