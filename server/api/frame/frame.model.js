'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FrameSchema = new Schema({
	name: {
		type: String,
		default: 'Untitled wireframe'
	},
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
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
	collaborators: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
  components: [{
		type: Schema.ObjectId,
		ref: 'Component'
	}],
  artboards: [{
		type: Schema.ObjectId,
		ref: 'Artboard'
	}],
  media: [{
    type: Schema.ObjectId,
    ref: 'Media'
  }]
});

FrameSchema.pre('update', function (next) {

	var now = new Date();
	this.updated_at = now;
	next();
});

module.exports = mongoose.model('Frame', FrameSchema);
