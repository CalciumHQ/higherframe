'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var ComponentSchema = new Schema({
  componentId: String,
	lastModifiedBy: String,
  properties: {}
});

module.exports = mongoose.model('Component', ComponentSchema);