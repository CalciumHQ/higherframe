
module Higherframe.Controllers {

  export class DashboardProjects {

    constructor(
      private projects: Array<Higherframe.Data.IProject>
    ) {}
  }
}

angular
  .module('siteApp')
  .controller('DashboardProjectsCtrl', Higherframe.Controllers.DashboardProjects);
