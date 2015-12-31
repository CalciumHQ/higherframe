/// <reference path="../typings/angularjs/angular.d.ts" />

angular.module('siteApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'btford.socket-io',
  'ui.router',
  'ui.router.title',
  'ui.bootstrap',
  'LocalStorageModule',
  'analytics.mixpanel',
  'monospaced.elastic'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $mixpanelProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    $mixpanelProvider.apiKey('af59676d763430037ae39d86282dbaca');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, $document, $timeout, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

    // Handle errors in routing
    $rootScope.$on('$stateChangeError', function() {

    });

    // Page transition class
    $rootScope.$on('$stateChangeStart', function (event, next, foo, prev) {

      var body = angular.element($document[0].body);

      if (next) {

        var ui = next.ui || 'default';
        body.addClass(`page-transition-${ ui }-enter`);
      }

      if (prev) {

        var ui = prev.ui || 'default';
        body.addClass(`page-transition-${ ui }-leave`);
      }
    });

    $rootScope.$on('$stateChangeSuccess', function() {

      var body = $document[0].body;
      var $body = angular.element(body);
      var classes = body.className.split(/\s+/);

      $timeout(() => {

        classes
          .filter((cl) => {

            return cl.match(/^page-transition-/);
          })
          .forEach((cl) => {

            $body.removeClass(cl);
          });
      }, 700);
    });
  });
