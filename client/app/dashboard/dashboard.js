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
          projects: function($stateParams, $http, $q, Auth) {

            var deferred = $q.defer();

            $http({
							url: '/api/projects',
							headers: {
								'Authorization': 'Bearer ' + Auth.getToken()
							}
						})
              .success(function (projects) {

                deferred.resolve(projects);
              })
              .error(function () {

                deferred.reject();
              });

             return deferred.promise;
          },
					$title: function() { return 'Dashboard'; }
        }
      })

			.state('dashboard.projects', {
				url: '/',
				templateUrl: 'app/dashboard/subviews/projects.html',
				controller: 'DashboardProjectsCtrl',
				controllerAs: 'DashboardProjectsCtrl',
				authenticate: true
			})

			.state('dashboard.settings', {
				url: '/settings',
				templateUrl: 'app/dashboard/subviews/settings.html',
				authenticate: true
			});
  });
