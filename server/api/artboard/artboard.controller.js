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
var Artboard = require('./artboard.model');
var Frame = require('./../frame/frame.model');

// Get list of Artboards
exports.index = function(req, res) {

  Artboard.find(function (err, Artboards) {

    if(err) { return handleError(res, err); }
    return res.json(200, Artboards);
  });
};

// Get a single Artboard
exports.show = function(req, res) {

  Artboard
    .findById(req.params.id)
    .exec(function (err, Artboard) {

      if(err) { return handleError(res, err); }
      if(!Artboard) { return res.send(404); }
      return res.json(Artboard);
    });
};

// Creates a new Artboard in the DB.
exports.create = function(req, res) {

  Artboard.create(req.body, function(err, Artboard) {

    if(err) { return handleError(res, err); }
    return res.json(201, Artboard);
  });
};

// Updates an existing Artboard in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Artboard.findById(req.params.id, function (err, artboard) {

    if (err) { return handleError(res, err); }
    if(!artboard) { return res.send(404); }

    var updated = _.merge(artboard, req.body);

    updated.save(function (err, artboard) {

      if (err) { return handleError(res, err); }
      return res.json(200, artboard);
    });
  });
};

// Deletes a Artboard from the DB.
exports.destroy = function(req, res) {

  Artboard.findById(req.params.id, function (err, artboard) {

    if(err) { return handleError(res, err); }
    if(!artboard) { return res.send(404); }

    artboard.remove(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {

  return res.send(500, err);
}
