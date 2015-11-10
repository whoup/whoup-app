var assign = require('../Lib/assignDefined');

var Model = function(options) {
  this.data = {};
  this.setAttributes(options);
};

Model.prototype.setAttributes = function(options) {
  options = (options || {});
  assign(this.data, {
    id: options.id,
    type_of_log: options.type_of_log,
    user_id: options.user_id,
    time: options.time,
    description: options.description,
    heart: options.heart,
    image: options.image.image,
    created_at: options.created_at,
    updated_at: options.updated_at,

    comments: options.comments
  });
};

module.exports = Model;
