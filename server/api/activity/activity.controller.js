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
var Activity = require('./activity.model');

// Get list of activity for a frame
exports.index = function(req, res) {

  if (!req.query.frameId) {

    return res.send(400);
  }

  Activity
    .find({ frame: req.query.frameId })
    .populate('user data.users')
    .exec(function (err, activities) {

      if(err) { return handleError(res, err); }
      return res.json(200, activities);
    });
};

// Get a single activity
exports.show = function(req, res) {

  Activity
		.findOne({ _id: req.params.id, users: req.user._id })
		.populate('frame user')
		.exec(function (err, activity) {

	    if(err) { return handleError(res, err); }
	    if(!activity) { return res.send(404); }

	    return res.json(activity);
	  });
};

// Creates a new activity in the DB.
exports.create = function(req, res) {

  Activity.create(req.body, function(err, activity) {

    if(err) { return handleError(res, err); }

    Activity.populate(activity, {path:'frame'}, function(err, activity) {

      if(err) { return handleError(res, err); }
      return res.json(201, activity);
    });
  });
};

// Updates an existing activity in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Activity.findById(req.params.id, function (err, activity) {

    if (err) { return handleError(res, err); }
    if(!activity) { return res.send(404); }
    var updated = _.merge(activity, req.body);
    activity.users = req.body.users;

    updated.save(function (err) {

      if (err) { return handleError(res, err); }
      return res.json(200, activity);
    });
  });
};

// Deletes a activity from the DB.
exports.destroy = function(req, res) {

  Activity.findById(req.params.id, function (err, activity) {

    if(err) { return handleError(res, err); }
    if(!activity) { return res.send(404); }

    activity.remove(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {

  return res.send(500, err);
}
