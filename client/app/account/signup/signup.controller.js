'use strict';

angular.module('siteApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $state, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.nameFocus = true;
    $scope.emailAddressFocus = false;
    $scope.passwordFocus = false;

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.onCancelButtonClick = function() {

      $state.go('login');
    };
  });
