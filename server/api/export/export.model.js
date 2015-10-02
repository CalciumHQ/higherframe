'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExportSchema = new Schema({
  created_at: {
		type: Date,
		default: Date.now
	},
  frame: {
    type: Schema.ObjectId,
    ref: 'Frame'
  },
  image: {
    type: Schema.ObjectId,
		ref: 'Image'
  }
});

if (mongoose.models.Export) {
  module.exports = mongoose.model('Export');
} else {
  module.exports = mongoose.model('Export', ExportSchema);
}
