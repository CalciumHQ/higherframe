
module Higherframe.Drawing.Component.Library {

  export class SelectInputPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.ISelectInputProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.ISelectInputProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('SelectInputPropertiesController', Higherframe.Drawing.Component.Library.SelectInputPropertiesController);
