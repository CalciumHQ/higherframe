/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/frames', require('./api/frame'));
	app.use('/api/components', require('./api/component'));
  app.use('/api/images', require('./api/image'));
  app.use('/api/exports', require('./api/export'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/organisations', require('./api/organisation'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
