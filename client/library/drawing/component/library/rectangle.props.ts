
module Higherframe.Drawing.Component.Library {

  export class RectanglePropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.IRectangleProperties;
    onFillColorChange: Function;
    onBorderColorChange: Function;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope, private $rootScope: ng.IRootScopeService) {

      this.properties = <Common.Data.IRectangleProperties>this.$scope.properties;
      this.onFillColorChange = this.onFillColorChangeHandler.bind(this);
      this.onBorderColorChange = this.onBorderColorChangeHandler.bind(this);
    }

    onFillColorChangeHandler(color) {

      this.$rootScope.$broadcast('properties:property:update');
    }

    onBorderColorChangeHandler(color) {

      this.$rootScope.$broadcast('properties:property:update');
    }
  }
}

angular
  .module('siteApp')
  .controller('RectanglePropertiesController', Higherframe.Drawing.Component.Library.RectanglePropertiesController);
