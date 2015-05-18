'use strict';

angular
	.module('siteApp')
  .config(function ($stateProvider) {

    $stateProvider
      .state('frame', {
        url: '/frame/:id',
        templateUrl: 'app/frame/frame.html',
        controller: 'FrameCtrl',
        resolve: {
          frame: function($stateParams, $http, $q) {
            
            var deferred = $q.defer();
            
            $http
              .get('/api/frames/' + $stateParams.id)
              .success(function (frame) {
                
                deferred.resolve(frame);
              })
              .error(function () {
                
                deferred.reject();
              });
              
             return deferred.promise;
          }
        }
      });
  });