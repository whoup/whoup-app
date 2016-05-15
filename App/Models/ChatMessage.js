var assign = require('../Lib/assignDefined');

var Model = function(options) {
  this.data = {};
  this.setAttributes(options);
};

Model.prototype.setAttributes = function(options) {
  options = (options || {});
  assign(this.data, {
    id: options.id,
    room_id: options.room_id,
    user: options.user,
    teammember: options.teammember,
    body: options.body,
    read: options.read,
    answered: options.answered,

    created_at: options.created_at,
    updated_at: options.updated_at
  });
};

module.exports = Model;
