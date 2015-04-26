'use strict';

angular
	.module('siteApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('frame', {
        url: '/frame',
        templateUrl: 'app/frame/frame.html',
        controller: 'FrameCtrl'
      });
  });