var EventEmitter = require('events').EventEmitter;
var assign   = require('object-assign');
var Keychain = require('react-native-keychain');

var CurrentUser    = require('../Models/CurrentUser');
var LocalKeyStore  = require('../Stores/LocalKeyStore');
var Dispatcher     = require('../Dispatcher');
var AppConstants   = require('../Constants/AppConstants');
var FirebaseRef    = require('../Api/FirebaseRef');

var CHANGE_EVENT     = 'change';
var LOCAL_STORE_KEY  = 'CurrentUser';
var KEYCHAIN_SERVICE = 'WhoUp';


var DeviceUUID = require("react-native-device-uuid");
var RemotePushIOS = require("../RemotePushIOS");

// null so we know to initialize on app launch
var _singleton = null;

function initSingleton(storedProps, token, username) {
  if (storedProps && token && username) {
    if (storedProps.id && storedProps.id === username.toString()) {
      // matches
      setUserProps(storedProps, token);
      return;
    }
  }
  setUserProps(null, null);
}

function setUserProps(storedProps, token) {
  _singleton = new CurrentUser(storedProps, token);
}

function saveSingleton() {
  if(_singleton) {
    LocalKeyStore.setKey(LOCAL_STORE_KEY, _singleton.data);
    if (_singleton.data.id && _singleton.getToken()) {
      Keychain.setGenericPassword(_singleton.data.id, _singleton.getToken(), KEYCHAIN_SERVICE);
    }
  }
}

function clearData() {
  //FirebaseRef.signOut(_singleton.data.token);
  _singleton = new CurrentUser(null, null);
  LocalKeyStore.setKey(LOCAL_STORE_KEY, null);
  Keychain.resetGenericPassword(KEYCHAIN_SERVICE);
}

function registerForPushNotifs(uid){
  DeviceUUID.getUUID().then(function(uuid) {
    RemotePushIOS.requestPermissions(function(err, data) {
      if (err) {
        console.log('shit')
      } else {
        // On success, data will contain your device token. You're probably going to want to send this to your server.
        FirebaseRef.registerForPush(uuid, uid, data.token);
      }
    });
  });

}

var SingletonStore = assign({}, EventEmitter.prototype, {
  get: function() {
    return _singleton;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
Dispatcher.register(function(action) {
  switch(action.actionType) {
    case AppConstants.APP_LAUNCHED:
      Keychain.
        getGenericPassword(KEYCHAIN_SERVICE)
        .then((credentials) => {
          LocalKeyStore.getKey(LOCAL_STORE_KEY, function(storeError, props) {
            initSingleton(props, credentials.password, credentials.username);
            SingletonStore.emitChange();
          });
        })
        .catch((err) => {
            initSingleton(null, null, null);
            SingletonStore.emitChange();
        }
      );
      break;
    case AppConstants.LOGIN_USER:
      registerForPushNotifs(action.userProps.id);
      // FirebaseRef.auth(action.token, () => {

      // });
    case AppConstants.USER_UPDATED:
      setUserProps(action.userProps, action.token);
      SingletonStore.emitChange();
      saveSingleton();
      break;
    case AppConstants.LOGOUT_REQUESTED:
    //console.log(_singleton)
      DeviceUUID.getUUID().then((uuid) => {
        FirebaseRef.signOut(_singleton.data.id, uuid);
        clearData();
        SingletonStore.emitChange();
      });
      break;
    default:
      // no op
  }
});

module.exports = SingletonStore;
