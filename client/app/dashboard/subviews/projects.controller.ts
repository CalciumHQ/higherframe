
module Higherframe.Controllers {

  export class DashboardProjects {

    sort = {
      value: 'name',
      options: {
        'name': 'Name',
        '-created_at': 'Date created'
      }
    }

    constructor(
      private $scope: ng.IScope,
      private projects: Array<Higherframe.Data.IProject>,
      private Auth,
      private $mixpanel,
      private socket,
      private AlertManager: Higherframe.UI.AlertManager,
      private ModalManager: Higherframe.UI.Modal.Manager
    ) {

      this.registerSockets();
      this.$scope.$on('$destroy', this.deregisterSockets);
    }


    /*
     * Initialization
     */

		private registerSockets() {

      // Register to receive updates to this user and its related models
  		this.socket.emit('user:subscribe', this.Auth.getCurrentUser()._id);

      // Document updating
			this.socket.syncUpdates('project', this.projects);
    }

    private deregisterSockets() {

			// Deregister from receiving updates to this user and its related models
			this.socket.emit('user:unsubscribe', this.Auth.getCurrentUser()._id);
      this.socket.unsyncUpdates('project');
		};


    /*
     * Event handlers
     */

		onNewProjectClick() {

      var modal = new Higherframe.Modals.Project.New(this.Auth, this.$mixpanel, this.AlertManager);
      this.ModalManager.present(modal);
		};
  }
}

angular
  .module('siteApp')
  .controller('DashboardProjectsCtrl', Higherframe.Controllers.DashboardProjects);
