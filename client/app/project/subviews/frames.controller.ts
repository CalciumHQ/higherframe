
module Higherframe.Controllers {

  export class ProjectFrames {

    sort = {
      value: 'name',
      options: {
        'name': 'Name',
        '-created_at': 'Date created'
      }
    }

    constructor(
      private $scope: ng.IScope,
      private $state,
      private $animate: ng.IAnimateService,
      private $window: ng.IWindowService,
      private $timeout: ng.ITimeoutService,
      private $http: ng.IHttpService,
      private project: Higherframe.Data.IProject,
      private socket,
      private ModalManager: Higherframe.UI.Modal.Manager,
      private AlertManager: Higherframe.UI.AlertManager,
      private Auth,
      private $mixpanel
    ) {

      this.registerSockets();
    }


    /*
     * Initialization
     */

		private registerSockets() {

      // Document updating
			this.socket.syncUpdates('frame', this.project.frames);
    }


    /*
     * Event handlers
     */

		onNewFrameClick() {

      var modal = new Higherframe.Modals.Frame.New(this.Auth, this.$mixpanel, this.AlertManager);
      modal.project = this.project;
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
  .controller('ProjectFramesCtrl', Higherframe.Controllers.ProjectFrames);
