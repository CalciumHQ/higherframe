'use strict';

angular.module('siteApp')
  .controller('PasswordCtrl', function ($scope, $state, User, Auth) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser();

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
          $state.go('settings');
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
    };
  });
