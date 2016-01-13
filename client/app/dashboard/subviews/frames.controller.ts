
module Higherframe.Controllers {

  export class DashboardFrames {

    personal: Array<Higherframe.Data.IFrame> = [];

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
      private AlertManager: Higherframe.UI.AlertManager,
      private Auth,
      private $mixpanel
    ) {

      this.registerSockets();

      $scope.$watchCollection(() => {

        return this.organisations;
      }, () => {

        this.updateOrganisations();
      });

      $scope.$watchCollection(() => {

        return this.frames;
      }, () => {

        this.updatePersonal();
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

    private updateOrganisations() {

    }


    /**
     *
     */

    private updatePersonal() {

      this.personal = this.frames.filter((frame) => !frame.organisation);
    }


    /*
     * Event handlers
     */

    onOrganisationSettingsClick($event, organisation) {

      var modal = new Higherframe.Modals.Organisation.Update(organisation);
      this.ModalManager.present(modal);
    }

		onNewFrameClick(organisation) {

      var modal = new Higherframe.Modals.Frame.New(this.Auth, this.$mixpanel, this.AlertManager);
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
  .controller('DashboardFramesCtrl', Higherframe.Controllers.DashboardFrames);
