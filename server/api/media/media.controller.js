/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Media = require('./media.model');
var User = require('./../user/user.model');
var config = require('../../config/environment');
var AWS = require('aws-sdk');
var fs = require('fs');

// Get list of medias
exports.index = function(req, res) {

  Media
    .find({ users: req.user._id })
    .populate('user')
    .exec(function (err, medias) {

    if(err) { return handleError(res, err); }
    return res.json(200, medias);
  });
};

// Get a single media
exports.show = function(req, res) {

  Media
		.findOne({ _id: req.params.id, users: req.user._id })
		.populate('user')
		.exec(function (err, media) {

	    if(err) { return handleError(res, err); }
	    if(!media) { return res.send(404); }

	    return res.json(media);
	  });
};

// Creates a new media in the DB.
exports.create = function(req, res) {

  // Configure AWS SDK
	AWS.config.region = config.aws.region;

	// Create S3 bucket interface
	var bucket = new AWS.S3({ params: { Bucket: config.aws.bucket } });

  // Iterate over files
	Object.keys(req.files).forEach(function (name) {

		var file = req.files[name];

		// Read file into file stream
		fs.readFile(file.path, function(err, fileBuffer) {

			// Upload image to bucket
			bucket.upload({ Key: file.filename, Body: fileBuffer, ContentType: file.mimetype }, function (err, data) {

				// Remove the temporary file
				fs.unlink(file.path);

				if(err) { return handleError(res, err); }

        // Save the new media entry with the AWS url
        var media = _.extend(req.body, { original: data.Location });

        Media.create(media, function(err, media) {

          if(err) { return handleError(res, err); }
          return res.json(201, media);
        });
			});
		});
	});
};

// Updates an existing media in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Media.findById(req.params.id, function (err, media) {

    if (err) { return handleError(res, err); }
    if(!media) { return res.send(404); }
    var updated = _.merge(media, req.body);

    updated.save(function (err) {

      if (err) { return handleError(res, err); }
      return res.json(200, media);
    });
  });
};

// Deletes a media from the DB.
exports.destroy = function(req, res) {

  Media.findById(req.params.id, function (err, media) {

    if(err) { return handleError(res, err); }
    if(!media) { return res.send(404); }

    media.remove(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {

  return res.send(500, err);
}
