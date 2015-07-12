
'use strict';

var _ = require('lodash');
var ComponentFactory = require('./../../../client/common/components/factory.js');
var paper = require('paper');
var fs = require('fs');
var Readable = require('stream').Readable
var Image = require('./../../api/image/image.model');


/**
 * When an image files have been successfully uploaded to S3
 */

var _imagesReady = function (urls, options) {

  // Create the image in the database
  Image.create({
    thumbnail: urls.thumbnail,
    small: urls.small,
    medium: urls.medium,
    large: urls.large
  }, function (err, Image) {

    if (err) { return options.error('Error saving image', 400); }
    return options.success(Image);
  });
};


/**
 * The export function
 */

exports.export = function (frame, fileName, options) {

  var fileType = options.fileType || 'png';
  var width = options.width || 2000;
  var height = options.height || 1000;

  // Set up a canvas to draw on
  var canvas = new paper.Canvas(width, height);
  paper.setup(canvas);

  // Get a layer to draw on
  var layer = paper.project.activeLayer;

  // Draw a white background
  var bg = new paper.Path.Rectangle(new paper.Rectangle(
    new paper.Point(0,0),
    new paper.Point(width, height)
  ));
  bg.fillColor = 'white';

  // Draw the components
  frame.components.forEach(function (component) {

    var marker = new paper.Path.Circle(new paper.Point(component.properties.x, component.properties.y), 10);
    marker.fillColor = 'black';

    ComponentFactory.create(component.componentId, component.properties);
  });

  // Perform the actual drawing to the canvas
  paper.view.update();

  // Output to an svg using paperjs svg export
  if (fileType == 'svg') {

    var path = 'tmp/' + fileName + '.svg';
    var out = fs.createWriteStream(__dirname + '/../../' + path);
    var svg = paper.project.exportSVG({ asString:true });
    out.write(svg);

    return _imagesReady({
      thumbnail: path,
      small: path,
      medium: path,
      large: path
    }, options);
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

      return _imagesReady({
        thumbnail: path,
        small: path,
        medium: path,
        large: path
      }, options);
    });
  }
};
