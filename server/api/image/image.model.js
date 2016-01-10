'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImageSchema = new Schema({
  original: String
});

if (mongoose.models.Image) {
  module.exports = mongoose.model('Image');
} else {
  module.exports = mongoose.model('Image', ImageSchema);
}
