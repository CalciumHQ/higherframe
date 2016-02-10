
module Higherframe.UI {
  export class PropertyType implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'A';
    require = 'ngModel';

    element: ng.IAugmentedJQuery;
    ngModel: ng.INgModelController;
    type: string;

    constructor(private $timeout: ng.ITimeoutService) {

      PropertyType.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

        this.element = element;
        this.ngModel = ngModel;

        this.type = (<any>attrs).propertyType;

        this.ngModel.$parsers.push((value) => this.transform.call(this, value));
        this.ngModel.$formatters.push((value) => this.transform.call(this, value));

        element.on('blur', () => this.$timeout(() => {

          this.render();
        }));
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = ($timeout: ng.ITimeoutService) => new PropertyType($timeout);
      directive.$inject = ['$timeout'];
      return directive;
    }

    transform(value: any): any {

      switch(this.type) {

        case 'Integer':
          value = parseInt(value) || 0;
          break;

        case 'Float':
          value = parseFloat(value) || 0.0;
          break;
      }

      return value;
    }

    render() {

      if (this.element) {

        this.element.val(this.transform(this.ngModel.$modelValue));
      }
    }
  }
}

angular
  .module('siteApp')
  .directive('propertyType', Higherframe.UI.PropertyType.factory());
