
'use strict';

var _ = require('lodash');
// var ComponentFactory = require('./../../../.tmp/library/drawing/component/factory.js');
var paper = require('paper');
var fs = require('fs');
var s3 = require('s3');
var Promise = require('promise');
var Readable = require('stream').Readable
var Image = require('./../../api/image/image.model');
var Export = require('./../../api/export/export.model');

/**
 * Save the images to S3
 */

var _saveImagesToS3 = function(paths) {

  var urls = {},
    promises = [];

  // For each of the paths that make up the different sizes of this image
  _.forEach(paths, function(path, key) {

    var p = new Promise(function (resolve, reject) {

      // Send to S3
      s3.send(path, function () {

        var url = 'something';

        urls[key] = url;
        resolve(url);
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
      thumbnail: urls.thumbnail,
      small: urls.small,
      medium: urls.medium,
      large: urls.large
    }, function (err, Image) {

      if (err) { return reject('Error saving image', 400); }

      return resolve(Image);
    });
  });
};


/**
 * Create and save an export model to represent the export
 */

var _createExportEntry = function(image, frame) {

  return new Promise(function (resolve, reject) {

    Export.create({
      image: image,
      frame: frame
    }, function (err, Export) {

      if (err) { return reject('Error saving export', 400); }
      return resolve(Export);
    });
  });
};


/**
 * The public export function
 */

exports.export = function (frame, fileName, options) {
options.error();
return;
  var fileType = options.fileType || 'png';

  frame.artboards.forEach(function(artboard) {

    // Set up a canvas to draw on
    var canvas = new paper.Canvas(artboard.width, artboard.height);
    paper.setup(canvas);

    // Get a layer to draw on
    var layer = paper.project.activeLayer;

    // Draw a white background
    var bg = new paper.Path.Rectangle(new paper.Rectangle(
      new paper.Point(0, 0),
      new paper.Point(artboard.width, artboard.height)
    ));
    bg.fillColor = 'white';

    // Draw the components
    frame.components.forEach(function (component) {

      var marker = new paper.Path.Circle(
        new paper.Point(component.properties.x - artboard.left, component.properties.y - artboard.top),
        10);

      marker.fillColor = 'black';
    });

    // Perform the actual drawing to the canvas
    paper.view.update();

    // Output to an svg using paperjs svg export
    if (fileType == 'svg') {

      var path = 'tmp/' + fileName + '.svg';
      var out = fs.createWriteStream(__dirname + '/../../' + path);
      var svg = paper.project.exportSVG({ asString:true });
      out.write(svg);

      var paths = {
        thumbnail: path,
        small: path,
        medium: path,
        large: path
      };

      return _saveImagesToS3(paths)
        .then(function(urls) { _createImageEntry(urls); })
        .then(function(image) { return _createExportEntry(image, frame); })
        .then(options.success)
        .catch(options.error);
    }

    // Output to another file type using a stream
    else {

      var out, stream, path;

      // Output to a png
      if (fileType == 'png') {

        path = 'tmp/' + fileName + '.png';
        out = fs.createWriteStream(__dirname + '/../../' + path);
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
          thumbnail: path,
          small: path,
          medium: path,
          large: path
        };

        return _saveImagesToS3(paths)
          .then(function(urls) { return _createImageEntry(urls); })
          .then(function(image) { return _createExportEntry(image, frame); })
          .then(options.success)
          .catch(options.error);
      });
    }
  });
};
