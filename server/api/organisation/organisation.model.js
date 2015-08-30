'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrganisationSchema = new Schema({
	name: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date
	},
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

OrganisationSchema.pre('update', function (next) {

	var now = new Date();
	this.updated_at = now;
	next();
});

module.exports = mongoose.model('Organisation', OrganisationSchema);
