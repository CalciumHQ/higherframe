'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ComponentSchema = new Schema({
  created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date
	},
  status: {
    type: String,
    default: 'active'
  },
  type: String,
	lastModifiedBy: String,
  frame: {
    type: Schema.ObjectId,
    ref: 'Frame'
  },
  properties: {},
  media: {
    type: Schema.ObjectId,
    ref: 'Media'
  }
});

ComponentSchema.pre('update', function (next) {

	var now = new Date();
	this.updated_at = now;
	next();
});

module.exports = mongoose.model('Component', ComponentSchema);
