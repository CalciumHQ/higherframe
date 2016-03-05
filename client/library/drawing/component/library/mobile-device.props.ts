
module Higherframe.Drawing.Component.Library {

  export class MobileDevicePropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.IMobileDeviceProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.IMobileDeviceProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('MobileDevicePropertiesController', Higherframe.Drawing.Component.Library.MobileDevicePropertiesController);
