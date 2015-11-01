'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResetSchema = new Schema({
  uuid: String,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  used: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reset', ResetSchema);
