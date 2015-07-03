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

			var card = angular.element($event.currentTarget);

			// Calculate position
			var rect = card[0].getBoundingClientRect();
			var x = rect.left + (rect.width/2);
			var y = rect.top + (rect.height/2);

			// Required transformation
			var translateX = ($window.innerWidth / 2) - x;
			var translateY = ($window.innerHeight / 2) - y;
			var scaleX = $window.innerWidth / rect.width;
			var scaleY = $window.innerHeight / rect.height;

			if (!card.hasClass('animateGrowToScreen')) {

				$animate.addClass(card, 'animateGrowToScreen');
				$animate.animate(card,
					{},
					{
						transform: 'translateX(' + translateX + 'px)' +
							' translateY(' + translateY + 'px)' +
							' scaleX(' + scaleX + ')' +
							' scaleY(' + scaleY + ')'
					}
				);

				$timeout(function () {

					$state.go('frame', { id: frame._id })
				}, 600);
			}

			else {

				$animate.removeClass(card, 'animateGrowToScreen');
				$animate.animate(card,
					{},
					{ transform: 'none'	}
				);
			}
		};

		$scope.onFrameDeleteClick = function ($event, frame) {

			// Stop the frame from opening
			$event.stopPropagation();

			$http.delete('/api/frames/' + frame._id);
		};


    (function init() {

    })();
  });
