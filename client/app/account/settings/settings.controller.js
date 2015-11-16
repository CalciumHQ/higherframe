'use strict';

angular.module('siteApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser();

    $scope.submit = function(form) {

      if (form.$valid) {

        User.update($scope.user);
      }
    };
  });
