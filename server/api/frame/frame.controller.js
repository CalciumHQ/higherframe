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
var Frame = require('./frame.model');
var Component = require('./../component/component.model');
var ComponentFactory = require('./../../../client/common/components/factory.js');
var paper = require('paper');
var fs = require('fs');

// Get list of frames
exports.index = function(req, res) {

  Frame.find(function (err, frames) {

    if(err) { return handleError(res, err); }
    return res.json(200, frames);
  });
};

// Get a single frame
exports.show = function(req, res) {

  Frame
		.findById(req.params.id)
		.populate('components collaborators')
		.exec(function (err, frame) {

	    if(err) { return handleError(res, err); }
	    if(!frame) { return res.send(404); }
	    return res.json(frame);
	  });
};

// Creates a new frame in the DB.
exports.create = function(req, res) {

  Frame.create(req.body, function(err, frame) {

    if(err) { return handleError(res, err); }
    return res.json(201, frame);
  });
};

// Updates an existing frame in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Frame.findById(req.params.id, function (err, frame) {

    if (err) { return handleError(res, err); }
    if(!frame) { return res.send(404); }
    var updated = _.merge(frame, req.body);

    updated.save(function (err) {

      if (err) { return handleError(res, err); }
      return res.json(200, frame);
    });
  });
};

// Deletes a frame from the DB.
exports.destroy = function(req, res) {

  Frame.findById(req.params.id, function (err, frame) {

    if(err) { return handleError(res, err); }
    if(!frame) { return res.send(404); }

    frame.remove(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Creates a new component in the DB for this frame.
exports.createComponent = function(req, res) {

	// Create the component
	Component.create(req.body, function(err, Component) {

    if(err) { return handleError(res, err); }

		// Add to the frame
		Frame.findOneAndUpdate(
			{ _id: req.params.id },
			{ $push: { components: Component._id }},
			{ safe: true, upsert: false },
			function (err, Frame) {

				if(err) { return handleError(res, err); }
				return res.json(201, Component);
			}
		)
  });
};

// Deletes a component from this frame.
exports.deleteComponent = function(req, res) {

	// Delete the component
	Component.findById(req.params.componentId, function (err, Component) {

    if(err) { return handleError(res, err); }
		if(!Component) { return res.send(404); }

		Component.remove(function (err) {

			if(err) { return handleError(res, err); }

			// Remove from the frame
			Frame.findOneAndUpdate(
				{ _id: req.params.frameId },
				{ $pull: { components: req.params.componentId }},
				{},
				function (err, Frame) {

					if(err) { return handleError(res, err); }
					return res.json(204);
				}
			);
		});
  });
};

exports.export = function (req, res) {

  Frame
		.findById(req.params.id)
		.populate('components')
		.exec(function (err, frame) {

	    if(err) { return handleError(res, err); }
	    if(!frame) { return res.send(404); }

      var width = 2000;
      var height = 1000;

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

      // Output to a png
      var out = fs.createWriteStream(__dirname + '/../../exports/export.png');
      var stream = canvas.pngStream();

      stream.on('data', function(chunk) {

        out.write(chunk);
      });

      stream.on('end', function() {

        return res.json(frame);
      });
	  });
};

function handleError(res, err) {

  return res.send(500, err);
}
