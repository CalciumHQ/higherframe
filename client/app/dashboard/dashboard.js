'use strict';

angular
	.module('siteApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
				templateUrl: 'app/dashboard/dashboard.html',
        abstract: true,
        controller: 'DashboardCtrl',
				controllerAs: 'DashboardCtrl',
				authenticate: true,
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
      })

			.state('dashboard.frames', {
				url: '/',
				templateUrl: 'app/dashboard/subviews/frames.html',
				controller: 'DashboardFramesCtrl',
				controllerAs: 'DashboardFramesCtrl',
			})

			.state('dashboard.settings', {
				url: '/settings',
				templateUrl: 'app/dashboard/subviews/settings.html'
			});
  });
