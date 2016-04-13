
module Higherframe.Drawing.Component.Library {

  export class ButtonPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.ButtonProperties;
    onFillColorChange: Function;
    onBorderColorChange: Function;

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

      this.properties = <Common.Data.ButtonProperties>this.$scope.properties;
      this.onFillColorChange = this.onFillColorChangeHandler.bind(this);
      this.onBorderColorChange = this.onBorderColorChangeHandler.bind(this);
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

    onFillColorChangeHandler(color) {

      this.$rootScope.$broadcast('properties:property:update');
    }

    onBorderColorChangeHandler(color) {

      this.$rootScope.$broadcast('properties:property:update');
    }
  }
}

angular
  .module('siteApp')
  .controller('ButtonPropertiesController', Higherframe.Drawing.Component.Library.ButtonPropertiesController);
