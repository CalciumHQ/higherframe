'use strict';

angular
  .module('siteApp')
  .controller('FramesCtrl', function ($scope, $state, $animate, $window, $timeout, $http, frames, socket) {

		/**
		 * Constants
		 */



    /*
     * Controller variables
     */

		$scope.frames = frames;


    /*
     * Initialization
     */

		function registerSockets () {

      // Document updating
			socket.syncUpdates('frame', $scope.frames);
    }

    (function () {

      registerSockets();
    })();

		/*
		 * Data methods
		 */



		/*
		 * Server notifications
		 */




    /*
     * Event handlers
     */

		$scope.onNewFrameClick = function () {

			$http.post('/api/frames', {});
		};

		$scope.onFrameClick = function ($event, frame) {

			$state.go('frame', { id: frame._id })
		};

		$scope.onFrameDeleteClick = function ($event, frame) {

			// Stop the frame from opening
			$event.stopPropagation();

			$http.delete('/api/frames/' + frame._id);
		};


    (function init() {

    })();
  });
