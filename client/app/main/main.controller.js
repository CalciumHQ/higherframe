'use strict';

angular
  .module('siteApp')
  .controller('MainCtrl', function ($scope, Auth) {

    $scope.isLoggedIn = Auth.isLoggedIn;
  });
