
module Higherframe.Drawing.Component.Library {

  export class ArrowPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.IArrowProperties;

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

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.IArrowProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('ArrowPropertiesController', Higherframe.Drawing.Component.Library.ArrowPropertiesController);
