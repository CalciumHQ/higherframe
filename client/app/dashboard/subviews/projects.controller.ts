
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
      private projects: Array<Higherframe.Data.IProject>,
      private Auth,
      private $mixpanel,
      private AlertManager: Higherframe.UI.AlertManager,
      private ModalManager: Higherframe.UI.Modal.Manager
    ) {}


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
