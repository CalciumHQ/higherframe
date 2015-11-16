'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MediaSchema = new Schema({
  created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date
	},
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  original: String
});

MediaSchema.pre('update', function (next) {

	var now = new Date();
	this.updated_at = now;
	next();
});

module.exports = mongoose.model('Media', MediaSchema);
