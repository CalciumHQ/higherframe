/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/paper/paper.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers {

  export class Frames {

    groups: any = [];

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $animate: ng.IAnimateService,
      private $window: ng.IWindowService,
      private $timeout: ng.ITimeoutService,
      private $http: ng.IHttpService,
      private frames: Array<any>,
      private organisations: Array<any>,
      private socket,
      private ModalManager: Higherframe.UI.Modal.Manager,
      private Auth,
      private $mixpanel
    ) {

      this.registerSockets();

      $scope.$watchCollection(() => {

        return this.organisations;
      }, () => {

        this.regroup();
      });

      $scope.$watchCollection(() => {

        return this.frames;
      }, () => {

        this.regroup();
      });
    }


    /*
     * Initialization
     */

		private registerSockets() {

      // Document updating
			this.socket.syncUpdates('frame', this.frames);
      this.socket.syncUpdates('organisation', this.organisations);
    }


    /**
     *
     */

    private regroup() {

      var groups = {};

      this.organisations.forEach((organisation) => {

        groups[organisation._id] =
          groups[organisation._id] ||
          {
            organisation: organisation,
            frames: []
          };
      });

      this.frames.forEach((frame) => {

        groups[frame.organisation._id] =
          groups[frame.organisation._id] ||
          {
            organisation: frame.organisation,
            frames: []
          };

        groups[frame.organisation._id].frames.push(frame);
      });

      this.groups = groups;
    }


    /*
     * Event handlers
     */

    onOrganisationSettingsClick($event, organisation) {

      var modal = new Higherframe.Modals.Organisation.Update(organisation);
      this.ModalManager.present(modal);
    }

		onNewFrameClick(organisation) {

      var modal = new Higherframe.Modals.Frame.New(this.Auth, this.$mixpanel);
      modal.organisation = organisation;
      this.ModalManager.present(modal);
		};

		onFrameClick($event, frame) {

			this.$state.go('frame', { id: frame._id })
		};

		onFrameDeleteClick($event, frame) {

			// Stop the frame from opening
			$event.stopPropagation();

			this.$http.delete('/api/frames/' + frame._id);
		};
  }
}

angular
  .module('siteApp')
  .controller('FramesCtrl', Higherframe.Controllers.Frames);
