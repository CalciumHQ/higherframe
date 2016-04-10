
module Higherframe.Drawing.Component.Library {

  export class ImagePropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.IImageProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope, private $rootScope: ng.IRootScopeService) {

      this.properties = <Common.Data.IImageProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('ImagePropertiesController', Higherframe.Drawing.Component.Library.ImagePropertiesController);
