
module Higherframe.Drawing.Component.Library {

  export class CheckboxPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.ICheckboxProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.ICheckboxProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('CheckboxPropertiesController', Higherframe.Drawing.Component.Library.CheckboxPropertiesController);
