
module Higherframe.Controllers {

  export class Dashboard {

    constructor(
      private $scope: ng.IScope,
      private $state
    ) {

    }
  }
}

angular
  .module('siteApp')
  .controller('DashboardCtrl', Higherframe.Controllers.Dashboard);
