
module Higherframe.Drawing.Component.Library {

  export class EllipsePropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.IEllipseProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.IEllipseProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('EllipsePropertiesController', Higherframe.Drawing.Component.Library.EllipsePropertiesController);
