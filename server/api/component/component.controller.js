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
var Component = require('./component.model');

// Get list of Components
exports.index = function(req, res) {
	
  Component.find(function (err, Components) {
	  
    if(err) { return handleError(res, err); }
    return res.json(200, Components);
  });
};

// Get a single Component
exports.show = function(req, res) {
  
  Component.findById(req.params.id, function (err, Component) {
	  
    if(err) { return handleError(res, err); }
    if(!Component) { return res.send(404); }
    return res.json(Component);
  });
};

// Creates a new Component in the DB.
exports.create = function(req, res) {
	
  Component.create(req.body, function(err, Component) {
	  
    if(err) { return handleError(res, err); }
    return res.json(201, Component);
  });
};

// Updates an existing Component in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Component.findById(req.params.id, function (err, Component) {
	  
    if (err) { return handleError(res, err); }
    if(!Component) { return res.send(404); }
    var updated = _.merge(Component, req.body);
		
		if (req.body.properties) {
			
			updated.markModified('properties');
		}
	
    updated.save(function (err) {
		
      if (err) { return handleError(res, err); }
      return res.json(200, Component);
    });
  });
};

// Deletes a Component from the DB.
exports.destroy = function(req, res) {
	
  Component.findById(req.params.id, function (err, Component) {
	  
    if(err) { return handleError(res, err); }
    if(!Component) { return res.send(404); }
	
    Component.remove(function(err) {
		
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
	
  return res.send(500, err);
}