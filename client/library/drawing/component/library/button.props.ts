
module Higherframe.Drawing.Component.Library {

  export class ButtonPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.IButtonProperties;

    typeOptions = {
      primary: 'Primary',
      secondary: 'Secondary'
    };

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.IButtonProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('ButtonPropertiesController', Higherframe.Drawing.Component.Library.ButtonPropertiesController);
