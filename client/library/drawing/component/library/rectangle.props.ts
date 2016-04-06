
module Higherframe.Drawing.Component.Library {

  export class RectanglePropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.IRectangleProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.IRectangleProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('RectanglePropertiesController', Higherframe.Drawing.Component.Library.RectanglePropertiesController);
