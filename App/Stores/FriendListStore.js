var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Friend       = require('../Models/Friend');
var Dispatcher   = require('../Dispatcher');
var AppConstants = require('../Constants/AppConstants');

var CHANGE_EVENT = 'change';

// TODO: Immutable?
var _hash = {};

function addModel(key, props) {
  if(!_hash[key]) _hash[key] = [];

  var model = new Friend(props);
  _hash[key].unshift(model);
}

function setList(key, list) {
  var models = [];
  for(var i in list) {
    var model = new Friend(list[i]);
    models.push(model);
  }
    _hash[key] = models;
}

var ModelStore = assign({}, EventEmitter.prototype, {
  get: function(key) {
    if (!_hash[key]) return null;
    return _hash[key];
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
    case AppConstants.FRIEND_LIST_UPDATED:
      setList(action.listProps.key, action.listProps.friends);
      ModelStore.emitChange();
      break;
    case AppConstants.FRIEND_ADDED:
      addModel(action.friendProps.key, action.friendProps.friendProps);
      ModelStore.emitChange();
      break;
    case AppConstants.FRIENDREQ_LIST_UPDATED:
      setList(action.listProps.key, action.listProps.friendReq);
      ModelStore.emitChange();
      break;
    case AppConstants.FRIENDREQ_ADDED:
      addModel(action.friendProps.key, action.friendProps.friendProps);
      ModelStore.emitChange();
      break;
    // TODO: save
    default:
      // no op
  }
});

module.exports = ModelStore;
