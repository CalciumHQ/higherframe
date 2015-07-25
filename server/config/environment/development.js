'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/site-dev'
    // uri: 'mongodb://root:higherpass@ds047592.mongolab.com:47592/higherframe-staging'
  },

  seedDB: true
};
