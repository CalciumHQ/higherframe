
module Higherframe.Drawing.Component.Library {

  export class TextInputPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.ITextInputProperties;

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.ITextInputProperties>this.$scope.properties;
    }
  }
}

angular
  .module('siteApp')
  .controller('TextInputPropertiesController', Higherframe.Drawing.Component.Library.TextInputPropertiesController);
