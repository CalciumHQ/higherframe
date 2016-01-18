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
var Project = require('./project.model');

// Get list of Projects
exports.index = function(req, res) {

  Project.find({ owner: req.user._id }, function (err, projects) {

    if(err) { return handleError(res, err); }
    return res.json(200, projects);
  });
};

// Get a single Project
exports.show = function(req, res) {

  Project
    .findById(req.params.id)
    .populate('frames')
    .exec(function (err, Project) {

      if(err) { return handleError(res, err); }
      if(!Project) { return res.send(404); }
      return res.json(Project);
    });
};

// Creates a new Project in the DB.
exports.create = function(req, res) {

  req.body.owner = req.user._id;
  
  Project.create(req.body, function(err, Project) {

    if(err) { return handleError(res, err); }
    return res.json(201, Project);
  });
};

// Updates an existing Project in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {

    if (err) { return handleError(res, err); }
    if(!project) { return res.send(404); }

    var updated = _.merge(project, req.body);

    updated.save(function (err, project) {

      if (err) { return handleError(res, err); }
      return res.json(200, project);
    });
  });
};

// Deletes a Project from the DB.
exports.destroy = function(req, res) {

  Project.findById(req.params.id, function (err, project) {

    if(err) { return handleError(res, err); }
    if(!project) { return res.send(404); }

    project.remove(function(err) {

      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {

  return res.send(500, err);
}
