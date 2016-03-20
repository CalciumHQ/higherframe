'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date
	},
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  name: {
    type: String,
    default: 'New project'
  },
  frames: [{
    type: Schema.ObjectId,
    ref: 'Frame'
  }]
});

ProjectSchema.pre('update', function (next) {

	var now = new Date();
	this.updated_at = now;
	next();
});

module.exports = mongoose.model('Project', ProjectSchema);
