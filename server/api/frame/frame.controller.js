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
var Artboard = require('./../artboard/artboard.model');
var Activity = require('./../activity/activity.model');
var User = require('./../user/user.model');
var mandrill = require('mandrill-api/mandrill');
var config = require('../../config/environment');
var exporter = require('./../../components/frame/exporter');

// Get list of frames
exports.index = function(req, res) {

  var query = Frame
    .find({ users: req.user._id })
    .populate('organisation users');

  if (!req.query.hasOwnProperty('include_deleted')) {

    query.where({ status: 'active' });
  }

  query.exec(function (err, frames) {

    if(err) { return handleError(res, err); }
    return res.json(200, frames);
  });
};

// Get a single frame
exports.show = function(req, res) {

  var query = Frame
		.findOne({ _id: req.params.id, users: req.user._id })
		.populate('organisation components artboards users collaborators media');

  if (!req.query.hasOwnProperty('include_deleted')) {

    query.where({ status: 'active' });
  }

  query.exec(function (err, frame) {

    if(err) { return handleError(res, err); }
    if(!frame) { return res.send(404); }

    var options = {
      path: 'components.media',
      model: 'Media'
    };

    Frame.populate(frame, options, function(err, frame) {

      frame.components.forEach(function(component) {

        component.properties.media = component.media;
        delete component.media;
      });

      return res.json(200, frame);
    });
  });
};

// Creates a new frame in the DB.
exports.create = function(req, res) {

  if(!req.body.organisation) { return handleError(res, null); }

  if (!_.find(req.body.users, function(user) { return req.user._id == req.user._id; })) {

    req.body.users = req.body.users || [];
    req.body.users.push(req.user);
  }

  // First create an artboard for the new frame
  Artboard.create({ name: 'Artboard 1' }, function(err, artboard) {

    req.body.artboards = [artboard._id];

    // Now create the frame
    Frame.create(req.body, function(err, frame) {

      if(err) { return handleError(res, err); }

      Frame.populate(frame, {path:'organisation artboards'}, function(err, frame) {

        if(err) { return handleError(res, err); }

        Activity.create({
          frame: frame._id,
          user: req.user._id,
          type: 'new-frame'
        });

        return res.json(201, frame);
      });
    });
  });
};

// Updates an existing frame in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  var query = Frame.findById(req.params.id);

  if (!req.query.hasOwnProperty('include_deleted')) {

    query.where({ status: 'active' });
  }

  query.exec(function (err, frame) {

    if (err) { return handleError(res, err); }
    if(!frame) { return res.send(404); }
    var updated = _.merge(frame, req.body);

    if (req.body.users) {

      updated.users = req.body.users;
    }

    updated.save(function (err) {

      if (err) { return handleError(res, err); }
      return res.json(200, frame);
    });
  });
};

// Deletes a frame from the DB.
exports.destroy = function(req, res) {

  var query = Frame.findById(req.params.id);

  if (!req.query.hasOwnProperty('include_deleted')) {

    query.where({ status: 'active' });
  }

  query.exec(function (err, frame) {

    if(err) { return handleError(res, err); }
    if(!frame) { return res.send(404); }

    frame.status = 'deleted';
    frame.save(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Shares this frame with a user.
exports.addUser = function(req, res) {

  // Add to the frame
  var query = Frame.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { users: { $each: req.body } }},
    { safe: true, upsert: false }
  );

  if (!req.query.hasOwnProperty('include_deleted')) {

    query.where({ status: 'active' });
  }

  query.exec(function (err, frame) {

    if(err) { return handleError(res, err); }

    Activity.create({
      frame: frame._id,
      user: req.user._id,
      type: 'added-user',
      data: { users: req.body }
    });


    /*
     * Send the share email
     */

    var client = new mandrill.Mandrill(config.mandrill.clientSecret);

    _.forEach(req.body, function(userId) {

      User.findById(userId, function(err, user) {

        var message = {
          html: '<h1>You have been invited to collaborate on ' + frame.name + '.</h1><p><a href="' + config.domain + '/frame/' + frame._id + '">Go to the document</a></p>',
          text: 'You have been invited to collaborate on ' + frame.name + '. Visit Higherframe to see this document.',
          subject: 'You have been added to a wireframe',
          from_email: 'support@higherfra.me',
          from_name: 'Higherframe',
          to: [
            {
              email: user.email,
              name: user.name,
              type: 'to'
            }
          ]
        };

        client.messages.send({
          message: message,
          async: true
        });
      });
    });

    return res.json(201, frame);
  });
};

// Creates a new component in the DB for this frame.
exports.createComponent = function(req, res) {

  // Add a reference to the frame
  req.body.frame = req.params.id;

	// Create the component
	Component.create(req.body, function(err, Component) {

    if(err) { return handleError(res, err); }

		// Add to the frame
		var query = Frame.findOneAndUpdate(
		  { _id: req.params.id },
		  { $push: { components: Component._id }},
		  { safe: true, upsert: false }
    );

    if (!req.query.hasOwnProperty('include_deleted')) {

      query.where({ status: 'active' });
    }

    query.exec(function (err, Frame) {

			if(err) { return handleError(res, err); }
			return res.json(201, Component);
		})
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
			var query = Frame.findOneAndUpdate(
			  { _id: req.params.frameId },
			  { $pull: { components: req.params.componentId }},
			  {}
      );

      if (!req.query.hasOwnProperty('include_deleted')) {

        query.where({ status: 'active' });
      }

      query.exec(function (err, Frame) {

				if(err) { return handleError(res, err); }
				return res.json(204);
			});
		});
  });
};

exports.export = function (req, res) {

  Frame
		.findById(req.params.id)
		.populate('components artboards')
		.exec(function (err, frame) {

	    if(err) { return handleError(res, err); }
	    if(!frame) { return res.send(404); }

      // Export parameters
      var fileName = frame._id;
      var fileType = req.query.type;

      // When export is complete
      function onSuccess(exp) {

        res.json(exp);
      }

      // When export fails
      function onError(msg, statusCode) {

        res.json({ msg: msg }, statusCode);
      }

      // Perform the export
      exporter
        .export(frame, fileName, {
          fileType: fileType,
          success: onSuccess,
          error: onError
        });
    });
};

function handleError(res, err) {

  return res.send(500, err);
}
