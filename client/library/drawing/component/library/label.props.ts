
module Higherframe.Drawing.Component.Library {

  export class LabelPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.ILabelProperties;

    private fontFamilyOptions = {
      'Helvetica Neue': 'Helvetica Neue',
      'Arial': 'Arial',
      'Myriad Pro': 'Myriad Pro',
      'Lucida Grande': 'Lucida Grande'
    };

    private fontWeightOptions = {
      '200': 'Light',
      '400': 'Regular',
      '500': 'Medium',
      '700': 'Bold'
    };

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope, private $rootScope: ng.IRootScopeService) {

      this.properties = <Common.Data.ILabelProperties>this.$scope.properties;
    }

    private onFontFamilySelect(value) {

      this.properties.fontFamily = value;

      this.$rootScope.$broadcast('properties:property:commit', {
        name: 'fontFamily',
        value: this.properties.fontFamily
      });
    }

    private onFontWeightSelect(value) {

      this.properties.fontWeight = parseInt(value);

      this.$rootScope.$broadcast('properties:property:commit', {
        name: 'fontWeight',
        value: this.properties.fontWeight
      });
    }
  }
}

angular
  .module('siteApp')
  .controller('LabelPropertiesController', Higherframe.Drawing.Component.Library.LabelPropertiesController);
