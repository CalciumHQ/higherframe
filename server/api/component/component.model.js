'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ComponentSchema = new Schema({
  type: String,
	lastModifiedBy: String,
  properties: {},
  media: {
    type: Schema.ObjectId,
    ref: 'Media'
  }
});

module.exports = mongoose.model('Component', ComponentSchema);
