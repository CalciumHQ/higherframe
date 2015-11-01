'use strict';

angular.module('siteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('forgot', {
        url: '/forgot',
        templateUrl: 'app/account/forgot/forgot.html',
        controller: 'ForgotCtrl'
      })
      .state('reset', {
        url: '/reset/:id',
        templateUrl: 'app/account/forgot/reset.html',
        controller: 'ResetCtrl',
        resolve: {
          reset: function($stateParams, Reset: Higherframe.Data.IResetResource) {

            return Reset.get({ id: $stateParams.id });
          }
        }
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });
