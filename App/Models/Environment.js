var assign = require('../Lib/assignDefined');

var Model = function(options) {
  this.data = {};
  this.setAttributes(options);
};

Model.prototype.setAttributes = function(options) {
  options = (options || {});
  assign(this.data, {
    name: options.name
  });
};

Model.prototype.getApiHost = function() {
  switch(this.data.name) {
    case 'test':
      return 'http://localhost:3000';
    case 'debug':
      return 'http://dev.joinrelease.com/v1';
    default:
      throw("Unknown Environment.getApiHost: " + this.data.name);
  }
};

module.exports = Model;
