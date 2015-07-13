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
var Export = require('./Export.model');

// Get list of Exports
exports.index = function(req, res) {

  Export
    .find()
    .populate('frame image')
    .exec(function (err, Exports) {

    if(err) { return handleError(res, err); }
    return res.json(200, Exports);
  });
};

// Get a single Export
exports.show = function(req, res) {

  Export
    .findById(req.params.id)
    .populate('frame image')
    .exec(function (err, Export) {

    if(err) { return handleError(res, err); }
    if(!Export) { return res.send(404); }
    return res.json(Export);
  });
};

// Creates a new Export in the DB.
exports.create = function(req, res) {

  Export.create(req.body, function(err, Export) {

    if(err) { return handleError(res, err); }
    return res.json(201, Export);
  });
};

// Updates an existing Export in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Export.findById(req.params.id, function (err, Export) {

    if (err) { return handleError(res, err); }
    if(!Export) { return res.send(404); }
    var updated = _.merge(Export, req.body);

    updated.save(function (err) {

      if (err) { return handleError(res, err); }
      return res.json(200, Export);
    });
  });
};

// Deletes a Export from the DB.
exports.destroy = function(req, res) {

  Export.findById(req.params.id, function (err, Export) {

    if(err) { return handleError(res, err); }
    if(!Export) { return res.send(404); }

    Export.remove(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {

  return res.send(500, err);
}
