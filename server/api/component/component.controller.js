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
var Frame = require('./../frame/frame.model');

// Get list of Components
exports.index = function(req, res) {

  var query = Component.find();

  if (!req.query.hasOwnProperty('include_deleted')) {

    query.where({ status: 'active' });
  }

  query.exec(function (err, Components) {

    if(err) { return handleError(res, err); }
    return res.json(200, Components);
  });
};

// Get a single Component
exports.show = function(req, res) {

  var query =  Component
    .findById(req.params.id)
    .populate('media');

  if (!req.query.hasOwnProperty('include_deleted')) {

    query.where({ status: 'active' });
  }

  query.exec(function (err, Component) {

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
  var query = Component.findById(req.params.id)

  if (!req.query.hasOwnProperty('include_deleted')) {

    query.where({ status: 'active' });
  }

  query.exec(function (err, component) {

    if (err) { return handleError(res, err); }
    if(!component) { return res.send(404); }

    if (req.body.media) {

      delete req.body.media;
    }

    var updated = _.merge(component, req.body);

    if (updated.properties.media) {

      // Since a Media object, we store outside of the properties block in
      // order to be able to utilise object ref population
      updated.media = (typeof updated.properties.media === 'object') ?
        updated.properties.media._id :
        updated.properties.media;

      delete updated.properties.media;
    }

		if (req.body.properties) {

			updated.markModified('properties');
		}

    updated.save(function (err) {

      if (err) { return handleError(res, err); }

      Component.populate(updated, { path: 'media' }, function(err, component) {

        component.properties.media = component.media;
        delete component.media;

        return res.json(200, component);
      });
    });
  });
};

// Deletes a Component from the DB.
exports.destroy = function(req, res) {

  var query = Component.findById(req.params.id)

  if (!req.query.hasOwnProperty('include_deleted')) {

    query.where({ status: 'active' });
  }

  query.exec(function (err, component) {

    if(err) { return handleError(res, err); }
    if(!component) { return res.send(404); }

    component.status = 'deleted';
    component.save(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {

  return res.send(500, err);
}
