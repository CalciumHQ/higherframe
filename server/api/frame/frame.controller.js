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
var frameExporter = require('./../../components/frame/exporter');

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

      // Export parameters
      var fileName = 'export';
      var fileType = req.query.type;

      // When export is complete
      function onSuccess(url) {

        res.json({
          url: url
        });
      }

      // When export fails
      function onError(msg, statusCode) {

        res.json({ msg: msg }, statusCode);
      }

      // Perform the export
      frameExporter.export(frame, fileName, {
        fileType: fileType,
        success: onSuccess,
        error: onError
      });
    });
};

function handleError(res, err) {

  return res.send(500, err);
}
