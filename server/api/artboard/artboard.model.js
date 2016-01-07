'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArtboardSchema = new Schema({
	lastModifiedBy: String,
  name: {
    type: String,
    default: 'New artboard'
  },
  width: {
    type: Number,
    default: 1024
  },
  height: {
    type: Number,
    default: 768
  },
  left: {
    type: Number,
    default: -512
  },
  top: {
    type: Number,
    default: -384
  }
});

module.exports = mongoose.model('Artboard', ArtboardSchema);
