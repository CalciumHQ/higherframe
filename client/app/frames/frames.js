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
					organisations: function($stateParams, $http, $q, Auth) {

            var deferred = $q.defer();

            $http({
							url: '/api/organisations',
							headers: {
								'Authorization': 'Bearer ' + Auth.getToken()
							}
						})
              .success(function (organisations) {

                deferred.resolve(organisations);
              })
              .error(function () {

                deferred.reject();
              });

             return deferred.promise;
          },
          frames: function($stateParams, $http, $q, Auth) {

            var deferred = $q.defer();

            $http({
							url: '/api/frames',
							headers: {
								'Authorization': 'Bearer ' + Auth.getToken()
							}
						})
              .success(function (frames) {

                deferred.resolve(frames);
              })
              .error(function () {

                deferred.reject();
              });

             return deferred.promise;
          },
					$title: function() { return 'Dashboard'; }
        }
      });
  });
