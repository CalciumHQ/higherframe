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


    /*
     * Initialization
     */

		function registerSockets() {

      // Document updating
			socket.syncUpdates('frame', frames);
    }

    function groupFrames() {

      var organisations = {};

      frames.forEach(function(frame) {

        organisations[frame.organisation._id] =
          organisations[frame.organisation._id] ||
          {
            organisation: frame.organisation,
            frames: []
          };

        organisations[frame.organisation._id].frames.push(frame);
      });

      $scope.organisations = organisations;
    };

    (function () {

      registerSockets();

      $scope.$watchCollection(function() {

        return frames;
      }, groupFrames);
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

		$scope.onNewFrameClick = function (organisation) {

			$http.post('/api/frames', { organisation: organisation._id });
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
