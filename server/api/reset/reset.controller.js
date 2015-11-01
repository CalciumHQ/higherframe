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
var Reset = require('./reset.model');

// Get a single reset request
exports.show = function(req, res) {
  Reset.findOne({ uuid: req.params.uuid })
    .populate('user')
    .exec(function (err, reset) {
      if(err) { return handleError(res, err); }
      if(!reset) { return res.send(404); }
      return res.json(reset);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}
