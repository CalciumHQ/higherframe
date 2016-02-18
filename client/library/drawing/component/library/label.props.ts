
module Higherframe.Drawing.Component.Library {

  export class LabelPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.ILabelProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.ILabelProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('LabelPropertiesController', Higherframe.Drawing.Component.Library.LabelPropertiesController);
