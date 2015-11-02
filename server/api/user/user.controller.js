'use strict';

var User = require('./user.model');
var Reset = require('./../reset/reset.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var mandrill = require('mandrill-api/mandrill');
var uuid = require('node-uuid');
var moment = require('moment');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {

  if (req.params.q) {

    res.json(200, {});
  }

  else {

    User.find({}, '-salt -hashedPassword', function (err, users) {
      if(err) return res.send(500, err);
      res.json(200, users);
    });
  }
};

/**
 * Searches users
 */
exports.query = function(req, res) {

  if (!req.query.q) {

    res.json(400, 'No q parameter provided');
  }

  User.find({ email: new RegExp(req.query.q, 'i') }, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.beta = false;
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);

    // Don't return a token while in private beta.
    // Can't log in a user until approved beta user
    // var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: /* token */ null });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Requests to reset a users password
 */
exports.requestResetPassword = function(req, res, next) {

  var email = req.body.email;

  User.findOne({ email: email }, function (err, user) {

    if (err) return res.send(500, err);
    if (!user) {

      res.send(200);
    }

    // Generate a random id
    var id = uuid.v4();
    var url = 'http://higherfra.me/reset/' + id;

    // Create the reset request
    var reset = { uuid: id, user: user._id };
    Reset.create(reset, function(err, reset) {

      if(err) return res.send(500, err);
    });

    // Send the reset email
    var client = new mandrill.Mandrill('bv-j2DeE5F8IZ6_ou9AHgg');

    var message = {
      html: '<h1>Password reset requested</h1><p>We\'ve received a request to reset the password on your Higherframe account. If you didn\'t initiate this request, feel free to ignore this email.</p><p><a href="' + url + '">Follow this link</a> to a secure page where you can change your password. Note this link will expire after 48 hours.</p>',
      text: 'We\'ve received a request to reset the password on your Higherframe account. If you didn\'t initiate this request, feel free to ignore this email. Follow this link to a secure page where you can change your password. Note this link will expire after 48 hours.',
      subject: 'Reset your password',
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
    }, function(result) {

      res.send(200);
    }, function(err) {

      res.send(500, err);
    });
  });
};

/**
 * Resets a password
 */
exports.resetPassword = function(req, res, next) {

  var resetId = req.body.resetId;
  var newPass = String(req.body.newPassword);

  Reset.findById(resetId)
    .populate('user')
    .exec(function (err, reset) {

    if (err) return res.send(500, err);
    if (reset) {

      // Test request hasn't been used
      if (reset.used) {

        return res.json(410, { message: 'This reset request has already been used' });
      }

      // Test request hasn't expired
      var created = moment(reset.created_at);
      var twoDaysAgo = moment().subtract(48, 'hours');
      if (created.isBefore(twoDaysAgo)) {

        return res.json(410, { message: 'This reset request has expired' });
      }

      // Change password
      reset.user.password = newPass;
      reset.user.save(function(err) {

        if (err) return validationError(res, err);

        reset.used = true;
        reset.save(function(err) {

          res.send(200);
        });
      });
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
