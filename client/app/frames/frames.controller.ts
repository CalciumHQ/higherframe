/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/paper/paper.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers {

  export class Frames {

    organisations: any = [];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $animate: ng.IAnimateService,
      private $window: ng.IWindowService,
      private $timeout: ng.ITimeoutService,
      private $http: ng.IHttpService,
      private frames: Array<any>,
      private socket,
      private ModalManager: Higherframe.UI.Modal.Manager
    ) {

      this.registerSockets();

      $scope.$watchCollection(() => {

        return this.frames;
      }, () => {

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

        this.organisations = organisations;
      });
    }


    /*
     * Initialization
     */

		private registerSockets() {

      // Document updating
			this.socket.syncUpdates('frame', this.frames);
    }


    /*
     * Event handlers
     */

		onNewFrameClick = function (organisation) {

      var modal = new Higherframe.Modals.Frame.New();
      modal.organisation = organisation;
      this.ModalManager.present(modal);
		};

		onFrameClick = function ($event, frame) {

			this.$state.go('frame', { id: frame._id })
		};

		onFrameDeleteClick = function ($event, frame) {

			// Stop the frame from opening
			$event.stopPropagation();

			this.$http.delete('/api/frames/' + frame._id);
		};
  }
}

angular
  .module('siteApp')
  .controller('FramesCtrl', Higherframe.Controllers.Frames);
