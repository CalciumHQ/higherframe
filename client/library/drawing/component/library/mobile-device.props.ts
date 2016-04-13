
module Higherframe.Drawing.Component.Library {

  export class MobileDevicePropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.MobileDeviceProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.MobileDeviceProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('MobileDevicePropertiesController', Higherframe.Drawing.Component.Library.MobileDevicePropertiesController);
