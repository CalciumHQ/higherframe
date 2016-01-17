
module Higherframe.Controllers {

  export class Project {

    constructor(
      private $scope: ng.IScope,
      private $state,
      private project: Higherframe.Data.IProject
    ) {

    }
  }
}

angular
  .module('siteApp')
  .controller('ProjectCtrl', Higherframe.Controllers.Project);
