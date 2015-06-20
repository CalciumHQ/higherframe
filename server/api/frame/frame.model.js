'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FrameSchema = new Schema({
	name: String,
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: { 
		type: Date 
	},
	collaborators: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
  components: [{
		type: Schema.ObjectId,
		ref: 'Component'
	}]
});

FrameSchema.pre('update', function (next) {
	
	var now = new Date();
	this.updated_at = now;
	next();
});

module.exports = mongoose.model('Frame', FrameSchema);