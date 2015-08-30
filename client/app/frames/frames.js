'use strict';

angular
	.module('siteApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('frames', {
        url: '/frames',
        templateUrl: 'app/frames/frames.html',
        controller: 'FramesCtrl',
				controllerAs: 'FramesCtrl',
        resolve: {
          frames: function($stateParams, $http, $q) {

            var deferred = $q.defer();

            $http
              .get('/api/frames')
              .success(function (frames) {

                deferred.resolve(frames);
              })
              .error(function () {

                deferred.reject();
              });

             return deferred.promise;
          }
        }
      });
  });
