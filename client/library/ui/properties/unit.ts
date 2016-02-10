
module Higherframe.UI {
  export class PropertySuffix implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'A';
    require = 'ngModel';

    element: ng.IAugmentedJQuery;
    ngModel: ng.INgModelController;
    suffix: string = '';

    constructor(private $timeout: ng.ITimeoutService) {

      PropertySuffix.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

        this.element = element;
        this.ngModel = ngModel;

        this.suffix = (<any>attrs).propertySuffix;

        this.ngModel.$parsers.push((value) => this.parse.call(this, value));
        this.ngModel.$formatters.unshift((value) => this.format.call(this, value));

        element.on('blur', () => this.$timeout(() => {

          this.render();
        }));
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = ($timeout: ng.ITimeoutService) => new PropertySuffix($timeout);
      directive.$inject = ['$timeout'];
      return directive;
    }

    transform(value: any): any {

      value = `${ value } ${ this.suffix }`;
      return value;
    }

    parse(value): any {

      /* // Remove the suffix
      let index = value.length - this.suffix.length;

      if (value.substring(index) == this.suffix) {

        value = value.substring(0, index);
      }

      value = value.trim(); */

      return value;
    }

    format(value): any {

      return this.transform(value);
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
  .directive('propertySuffix', Higherframe.UI.PropertySuffix.factory());
