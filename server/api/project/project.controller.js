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
var User = require('./../user/user.model');
var mandrill = require('mandrill-api/mandrill');
var config = require('../../config/environment');

// Get list of Projects
exports.index = function(req, res) {

  Project
    .find({ users: req.user._id })
    .populate('users')
    .exec(function (err, projects) {

    if(err) { return handleError(res, err); }
    return res.json(200, projects);
  });
};

// Get a single Project
exports.show = function(req, res) {

  Project
    .findOne({ _id: req.params.id, users: req.user._id })
    .populate('frames users')
    .exec(function (err, Project) {

      if(err) { return handleError(res, err); }
      if(!Project) { return res.send(404); }
      return res.json(Project);
    });
};

// Creates a new Project in the DB.
exports.create = function(req, res) {

  req.body.owner = req.user._id;

  if (!_.find(req.body.users, function(user) { return user._id == req.user._id; })) {

    req.body.users = req.body.users || [];
    req.body.users.push(req.user);
  }

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

    if (req.body.users) {

      updated.users = req.body.users;
    }

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

// Shares this project with a user.
exports.addUser = function(req, res) {

  // Add to the project
  Project.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { users: { $each: req.body } }},
      { safe: true, upsert: false }
    ).exec(function (err, project) {

      if(err) { return handleError(res, err); }


      /*
       * Send the share email
       */

      var client = new mandrill.Mandrill(config.mandrill.clientSecret);

      _.forEach(req.body, function(userId) {

        User.findById(userId, function(err, user) {

          var message = {
            html: '<h1>You have been invited to collaborate on ' + project.name + '.</h1><p><a href="' + config.domain + '/project/' + project._id + '">View project</a></p>',
            text: 'You have been invited to collaborate on ' + project.name + '. Visit Higherframe to view this project.',
            subject: 'You have been added to a project',
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

      return res.json(201, project);
    });
};

function handleError(res, err) {

  return res.send(500, err);
}
