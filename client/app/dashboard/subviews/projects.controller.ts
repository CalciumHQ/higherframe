
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
      private projects: Array<Higherframe.Data.IProject>
    ) {}
  }
}

angular
  .module('siteApp')
  .controller('DashboardProjectsCtrl', Higherframe.Controllers.DashboardProjects);
