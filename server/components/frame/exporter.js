
'use strict';

var _ = require('lodash');
var paper = require('paper');
var config = require('../../config/environment');
var Common = require('./../../../.tmp-server/common.js')
var fs = require('fs');
var Promise = require('promise');
var Readable = require('stream').Readable
var Image = require('./../../api/image/image.model');
var Export = require('./../../api/export/export.model');
var AWS = require('aws-sdk');

/**
 * Save the images to S3
 */

var _saveImagesToS3 = function(paths, mimetype) {

  var urls = {},
    promises = [];

  // Configure AWS SDK
	AWS.config.region = config.aws.region;

	// Create S3 bucket interface
	var bucket = new AWS.S3({ params: { Bucket: config.aws.bucket } });

  // For each of the paths that make up the different sizes of this image
  _.forEach(paths, function(path, key) {

    var parts = path.split('/');
    var filename = parts.pop();

    var p = new Promise(function (resolve, reject) {

      // Read file into file stream
      fs.readFile(path, function(err, fileBuffer) {

        // Upload image to bucket
        bucket.upload({ Key: key + '-' + filename, Body: fileBuffer, ContentType: mimetype }, function (err, data) {

          // Remove the temporary file
          fs.unlink(path);

          if (err) { reject(err); }

          var url = data.Location;
          urls[key] = url;
          resolve(url);
        });
      });
    });

    promises.push(p);
  });

  return Promise
    .all(promises)
    .then(function () {

      return new Promise(function (resolve) {

        resolve(urls);
      });
    });
};


/**
 * Create and save an image model to represent the new image
 */

var _createImageEntry = function(urls) {

  return new Promise(function (resolve, reject) {

    Image.create({
      original: urls.o
    }, function (err, image) {

      if (err) { return reject('Error saving image', 400); }

      return resolve(image);
    });
  });
};


/**
 * Create and save an export model to represent the export
 */

var _createExportEntry = function(image, frame) {

  return new Promise(function (resolve, reject) {

    Export.create({
      image: image._id,
      frame: frame
    }, function (err, exp) {

      if (err) { return reject('Error saving export', 400); }

      // We already have the image so no need to populate
      Export.populate(exp, 'image', function(err, exp) {

        if (err) { reject('Error populating export', 400); }
        return resolve(exp);
      });
    });
  });
};


/**
 * The public export function
 */

exports.export = function (frame, fileName, options) {

  var fileType = options.fileType || 'png';

  frame.artboards.forEach(function(artboard) {

    // Set up a canvas to draw on
    var canvas = new paper.Canvas(artboard.width, artboard.height);
    paper.setup(canvas);

    // Get a layer to draw on
    var layer = paper.project.activeLayer;

    // Draw a white background
    var bg = new paper.Path.Rectangle(new paper.Rectangle(
      new paper.Point(artboard.left, artboard.top),
      new paper.Point(artboard.width, artboard.height)
    ));
    bg.fillColor = 'white';

    // Draw the components
    frame.components.forEach(function (component) {

      var component = Common.Drawing.Component.Factory.get(Common.Drawing.Component.Type[component.type], component);
    });

    // Translate contents relative to artboard position
    layer.translate(new paper.Point(-artboard.left, -artboard.top));

    // Perform the actual drawing to the canvas
    paper.view.update();

    // Output to an svg using paperjs svg export
    if (fileType == 'svg') {

      var path = __dirname + '/../../tmp/' + fileName + '.svg';
      var out = fs.createWriteStream(path);
      var svg = paper.project.exportSVG({ asString:true });
      out.write(svg);

      var paths = {
        o: path
      };

      return _saveImagesToS3(paths, 'image/svg+xml')
        .then(function(urls) { return _createImageEntry(urls); })
        .then(function(image) { return _createExportEntry(image, frame); })
        .then(options.success)
        .catch(options.error);
    }

    // Output to another file type using a stream
    else {

      var out, stream, path;

      // Output to a png
      if (fileType == 'png') {

        var path = __dirname + '/../../tmp/' + fileName + '.png';
        out = fs.createWriteStream(path);
        stream = canvas.pngStream();
      }

      else {

        return options.error('Invalid filetype', 400);
      }

      stream.on('data', function(chunk) {

        out.write(chunk);
      });

      stream.on('end', function() {

        var paths = {
          o: path
        };

        return _saveImagesToS3(paths, 'image/png')
          .then(function(urls) { return _createImageEntry(urls); })
          .then(function(image) { return _createExportEntry(image, frame); })
          .then(options.success)
          .catch(options.error);
      });
    }
  });
};
