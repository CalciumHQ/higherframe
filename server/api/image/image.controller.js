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
var Image = require('./image.model');

// Get list of Images
exports.index = function(req, res) {

  Image.find(function (err, Images) {

    if(err) { return handleError(res, err); }
    return res.json(200, Images);
  });
};

// Get a single Image
exports.show = function(req, res) {

  Image.findById(req.params.id, function (err, Image) {

    if(err) { return handleError(res, err); }
    if(!Image) { return res.send(404); }
    return res.json(Image);
  });
};

// Creates a new Image in the DB.
exports.create = function(req, res) {

  Image.create(req.body, function(err, Image) {

    if(err) { return handleError(res, err); }
    return res.json(201, Image);
  });
};

// Updates an existing Image in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Image.findById(req.params.id, function (err, Image) {

    if (err) { return handleError(res, err); }
    if(!Image) { return res.send(404); }
    var updated = _.merge(Image, req.body);

    updated.save(function (err) {

      if (err) { return handleError(res, err); }
      return res.json(200, Image);
    });
  });
};

// Deletes a Image from the DB.
exports.destroy = function(req, res) {

  Image.findById(req.params.id, function (err, Image) {

    if(err) { return handleError(res, err); }
    if(!Image) { return res.send(404); }

    Image.remove(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {

  return res.send(500, err);
}
