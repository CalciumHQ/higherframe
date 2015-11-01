'use strict';

angular.module('siteApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      requestResetPassword: {
        method: 'POST',
        params: {
          controller:'reset'
        }
      },
      resetPassword: {
        method: 'PUT',
        params: {
          controller:'reset'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
