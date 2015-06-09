'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FrameSchema = new Schema({
	collaborators: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
  components: [{
		type: Schema.ObjectId,
		ref: 'Component'
	}]
});

module.exports = mongoose.model('Frame', FrameSchema);