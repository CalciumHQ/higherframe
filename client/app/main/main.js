'use strict';

angular.module('siteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
          redirect: function($state, $q, $timeout, Auth) {

            return $q(function(resolve, reject) {

              // Redirection requires asynchronous
              $timeout(function() {

                if (Auth.isLoggedIn()) {

                  $state.go('dashboard.frames');
                  reject();
                }

                else {

                  resolve();
                }
              });
            }).promise;
          }
        }
      });
  });
