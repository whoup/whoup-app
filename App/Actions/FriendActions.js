var Dispatcher    = require('../Dispatcher');
var AppConstants  = require('../Constants/AppConstants');
var Firebase      = require('firebase');
var ref = new Firebase('http://whoup.firebaseIO.com/')
var UserService = require('../Api/UserService');
var CurrentUserStore = require('../Stores/CurrentUserStore');
var CURRENT_USER = CurrentUserStore.get().data;
var FriendActions = {
  fetchList: function(uid, callback) {
    UserService.fetchFriendList(uid, function(error, listProps) {
      if(callback) callback(error);

      if (!error) {
        Dispatcher.dispatch({
          actionType: AppConstants.FRIEND_LIST_UPDATED,
          listProps: listProps
        });
      }
    });
  },
  fetchRequestList: function(uid, callback) {
    UserService.fetchRequestList(uid, function(error, listProps) {
      if(callback) callback(error);
      if (!error) {
        Dispatcher.dispatch({
          actionType: AppConstants.FRIENDREQ_LIST_UPDATED,
          listProps: listProps
        });
      }
    });
  },

  mountFriendAdd: function(uid) {
    ref.child('users').child(uid).child('friends').on('child_added', function(snapshot, prevKey) {
      var newFriend = snapshot.val();
      var data = {
        key: 'friend',
        friendProps: {
          id: newFriend.id,
          username: newFriend.username,
        }
      };
        Dispatcher.dispatch({
          actionType: AppConstants.FRIEND_ADDED,
          friendProps: data
        });
    })
  },

  mountFriendReq: function(uid) {
    ref.child('users').child(uid).child('friend_reqs').on('child_added', function(snapshot, prevKey){
      var newReq = snapshot.val();
      var data = {
        key: 'request',
        friendProps: {
          id: newReq.id,
          username: newReq.username,
        }
      };
       Dispatcher.dispatch({
          actionType: AppConstants.FRIENDREQ_ADDED,
          friendProps: data
        });
    });
  },

  addFriend: function(uid, username, callback) {
    ref.child('users').child(uid).child('friend_reqs').child(CURRENT_USER.id).transaction(function(currentData) {
      if (currentData === null) {
        return {username: CURRENT_USER.username}
        return data;
      } else {

      return callback({message: "Request already sent"}); // Abort the transaction.
    }
    }, function(error, committed, snapshot) {
      if (error) {
        console.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        console.log('We aborted the transaction (because wilma already exists).');
      } else {
        ref.child('users').child(CURRENT_USER.id).child('sent_reqs').child(uid).set({username: username})
        callback();
      }
    });
  }
};

module.exports = FriendActions;
