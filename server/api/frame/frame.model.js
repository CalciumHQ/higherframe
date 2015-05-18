'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var ComponentSchema = new Schema({
  componentId: String,
  properties: {}
});

var FrameSchema = new Schema({
  components: [ComponentSchema]
});

module.exports = mongoose.model('Frame', FrameSchema);