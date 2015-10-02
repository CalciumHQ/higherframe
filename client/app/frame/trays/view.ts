/// <reference path="../../../library/higherframe.ts"/>

module Higherframe.Controllers.Frame {

  export class ViewTrayController {

    zoom: number = 1;

    constructor($scope: ng.IScope) {

      $scope.$on('controller:view:zoom', (event, zoom) => {

        this.zoom = zoom;
      });
    }
  }

  export class ViewTray implements Higherframe.UI.ITray {

    label = 'View';
    templateUrl = '/app/frame/trays/view.html';
    controller = ViewTrayController;
  }
}
