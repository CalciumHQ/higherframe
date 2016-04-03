
module Higherframe.Drawing.Component.Library {

  export class BrowserPropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.IBrowserProperties;
    size: string;

    onSliderChange: Function;
    onSliderEnd: Function;

    private sizeOptions = [
      {
        value: 'iphone5',
        label: 'iPhone 5',
        width: 200,
        height: 300
      },
      {
        value: 'ipad',
        label: 'iPad',
        width: 600,
        height: 800
      },
      {
        value: 'ipadMini',
        label: 'iPad Mini',
        width: 600,
        height: 400
      }
    ];

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope, private $rootScope: ng.IRootScopeService) {

      this.properties = <Common.Data.IBrowserProperties>this.$scope.properties;

      this.$scope.$watch(() => this.properties.width, () => this.sizeChanged());
      this.$scope.$watch(() => this.properties.height, () => this.sizeChanged());
    }

    private sizeChanged() {

      var option = _.find(this.sizeOptions, (option: any) => {

        return (option.width == this.properties.width &&
          option.height == this.properties.height);
      });

      option = option || {
        value: 'custom',
        label: 'Custom'
      };

      this.size = option;
    }

    private onSizeSelect(option) {

      this.size = option;

      if (option.width) {

        this.properties.width = option.width;

        this.$rootScope.$broadcast('properties:property:commit', {
          name: 'width',
          value: this.properties.width
        });
      }

      if (option.height) {

        this.properties.height = option.height;

        this.$rootScope.$broadcast('properties:property:commit', {
          name: 'height',
          value: this.properties.height
        });
      }
    }
  }
}

angular
  .module('siteApp')
  .controller('BrowserPropertiesController', Higherframe.Drawing.Component.Library.BrowserPropertiesController);
