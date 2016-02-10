
module Higherframe.Drawing.Component.Library {

  export class MobileDevicePropertiesController implements Higherframe.UI.Component.IProperties {

    public models: any = {};

    private sizeOptions = {
      'iphone5': 'iPhone 5',
      'ipad': 'iPad',
      'ipadMini': 'iPad Mini'
    };

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.models = angular.copy(this.getProperties());

    }

    private getProperties(): Common.Data.IMobileDeviceProperties {

      return <Common.Data.IMobileDeviceProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('MobileDevicePropertiesController', Higherframe.Drawing.Component.Library.MobileDevicePropertiesController);
