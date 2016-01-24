'use strict';

angular
	.module('siteApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('project', {
        url: '/project/:id',
				templateUrl: 'app/project/project.html',
        controller: 'ProjectCtrl',
        controllerAs: 'ProjectCtrl',
        abstract: true,
				authenticate: true,
        resolve: {
          project: function($stateParams, Project) {

            return Project.get({ id: $stateParams.id }).$promise;
          },
					$title: function(project) { return project.name; }
				}
      })

			.state('project.frames', {
				url: '',
				templateUrl: 'app/project/subviews/frames.html',
				controller: 'ProjectFramesCtrl',
        controllerAs: 'ProjectFramesCtrl'
			})

			.state('project.settings', {
				url: '/settings',
				templateUrl: 'app/project/subviews/settings.html'
			});
  });
