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
var Organisation = require('./organisation.model');

// Get list of Organisations
exports.index = function(req, res) {

  Organisation
    .find()
    .populate('frame image')
    .exec(function (err, Organisations) {

    if(err) { return handleError(res, err); }
    return res.json(200, Organisations);
  });
};

// Get a single Organisation
exports.show = function(req, res) {

  Organisation
    .findById(req.params.id)
    .populate('frame image')
    .exec(function (err, Organisation) {

    if(err) { return handleError(res, err); }
    if(!Organisation) { return res.send(404); }
    return res.json(Organisation);
  });
};

// Creates a new Organisation in the DB.
exports.create = function(req, res) {

  Organisation.create(req.body, function(err, Organisation) {

    if(err) { return handleError(res, err); }
    return res.json(201, Organisation);
  });
};

// Updates an existing Organisation in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Organisation.findById(req.params.id, function (err, Organisation) {

    if (err) { return handleError(res, err); }
    if(!Organisation) { return res.send(404); }
    var updated = _.merge(Organisation, req.body);

    updated.save(function (err) {

      if (err) { return handleError(res, err); }
      return res.json(200, Organisation);
    });
  });
};

// Deletes a Organisation from the DB.
exports.destroy = function(req, res) {

  Organisation.findById(req.params.id, function (err, Organisation) {

    if(err) { return handleError(res, err); }
    if(!Organisation) { return res.send(404); }

    Organisation.remove(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {

  return res.send(500, err);
}
