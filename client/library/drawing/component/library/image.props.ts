
module Higherframe.Drawing.Component.Library {

  export class ImagePropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.ImageProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope, private $rootScope: ng.IRootScopeService) {

      this.properties = <Common.Data.ImageProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('ImagePropertiesController', Higherframe.Drawing.Component.Library.ImagePropertiesController);
