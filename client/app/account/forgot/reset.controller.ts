'use strict';

angular.module('siteApp')
  .controller('ResetCtrl', function (reset: Higherframe.Data.IReset, $scope, Auth, $state, $window) {

    $scope.reset = reset;
    $scope.user = {};
    $scope.errors = {};

    $scope.submit = function(form) {
      $scope.submitted = true;

      if(form.$valid) {

        Auth.resetPassword($scope.reset._id, $scope.user.password)
        .then( function() {
          // Reset password, redirect to login
          $state.go('login');
        })
        .catch( function(response) {
          $scope.errors.other = response.data.message;
        });
      }
    };

    $scope.onCancelButtonClick = function() {

      $state.go('login');
    };
  });
