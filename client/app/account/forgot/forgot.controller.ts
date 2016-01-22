'use strict';

angular.module('siteApp')
  .controller('ForgotCtrl', function ($scope, Auth, $state, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.emailAddressFocus = true;

    $scope.submit = function(form) {
      $scope.submitted = true;

      if(form.$valid) {

        Auth.requestResetPassword($scope.user.email)
        .then( function() {
          // Sent email, redirect to home
          $state.go('login');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.onCancelButtonClick = function() {

      $state.go('login');
    };
  });
