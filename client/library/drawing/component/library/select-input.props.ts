
module Higherframe.Drawing.Component.Library {

  export class SelectInputPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.SelectInputProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.SelectInputProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('SelectInputPropertiesController', Higherframe.Drawing.Component.Library.SelectInputPropertiesController);
