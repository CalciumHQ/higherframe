
module Higherframe.Drawing.Component.Library {

  export class ArrowPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.ArrowProperties;
    onBorderColorChange: Function;

    typeOptions = {
      straight: 'Straight',
      curve: 'Curve',
      angle: 'Angle',
      dangle: 'Double Angle'
    };

    directionOptions = {
      left: 'Left',
      right: 'Right',
      both: 'Both'
    };

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope, private $rootScope: ng.IRootScopeService) {

      this.properties = <Common.Data.ArrowProperties>this.$scope.properties;
      this.onBorderColorChange = this.onBorderColorChangeHandler.bind(this);
    }

    onBorderColorChangeHandler(color) {

      this.$rootScope.$broadcast('properties:property:update');
    }
  }
}

angular
  .module('siteApp')
  .controller('ArrowPropertiesController', Higherframe.Drawing.Component.Library.ArrowPropertiesController);
