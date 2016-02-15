
module Higherframe.Drawing.Component.Library {

  export class MobileDevicePropertiesController implements Higherframe.UI.Component.PropertiesController {

    properties: Common.Data.IMobileDeviceProperties;
    size: string;

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

    constructor(private $scope: Higherframe.UI.Component.IPropertiesScope) {

      this.properties = <Common.Data.IMobileDeviceProperties>this.$scope.properties;

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

      if (option.width) { this.properties.width = option.width; }
      if (option.height) { this.properties.height = option.height; }
    }
  }
}

angular
  .module('siteApp')
  .controller('MobileDevicePropertiesController', Higherframe.Drawing.Component.Library.MobileDevicePropertiesController);
