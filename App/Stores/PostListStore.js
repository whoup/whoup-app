var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActivityLog  = require('../Models/ActivityLog');
var FoodLog      = require('../Models/FoodLog');
var Dispatcher   = require('../Dispatcher');
var AppConstants = require('../Constants/AppConstants');

var CHANGE_EVENT = 'change';

// TODO: Immutable?
var _hash = {};

function addModel(key, props) {
  if(!_hash[key]) _hash[key] = [];

  var model;

  if (props.type_of_log === 'activity')
    model = new ActivityLog(props);
  else if (props.type_of_log === 'food')
    model = new FoodLog(props);

  _hash[key].unshift(model);
}

function setList(key, list) {
  var models = [];
  for(var i in list) {

    var model;
    if (list[i].type_of_log == 'activity')
      model = new ActivityLog(list[i]);
    else if (list[i].type_of_log == 'food')
      model = new FoodLog(list[i]);

    models.push(model);
  }
  _hash[key] = models;
}

var ModelStore = assign({}, EventEmitter.prototype, {

  get: function(key) {
    return _hash[key];
  },


  emitChange: function(key) {
    this.emit(CHANGE_EVENT, key);
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
    case AppConstants.POST_LIST_UPDATED:
      setList(action.listProps.username, action.listProps.posts);
      ModelStore.emitChange(action.listProps.username);
      break;
    case AppConstants.POST_ADDED:
      addModel(action.postProps.username, action.postProps);
      ModelStore.emitChange(action.postProps.username);
      break;
    // TODO: save
    default:
      // no op
  }
});

module.exports = ModelStore;
