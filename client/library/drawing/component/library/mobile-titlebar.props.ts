
module Higherframe.Drawing.Component.Library {

  export class MobileTitlebarPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.MobileTitlebarProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.MobileTitlebarProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('MobileTitlebarPropertiesController', Higherframe.Drawing.Component.Library.MobileTitlebarPropertiesController);
