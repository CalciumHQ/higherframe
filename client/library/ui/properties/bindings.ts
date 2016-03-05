
module Higherframe.UI {
  export class PropertyBindings implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'A';
    require = 'ngModel';

    isPreventingCommit: boolean = false;

    constructor(private $timeout: ng.ITimeoutService, private $rootScope: ng.IRootScopeService) {

      PropertyBindings.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

        var name = (<any>attrs).propertyName;

        // Prevent keystrokes from bubbling to the rest of the document
        element.on('keydown', (event) => event.stopPropagation());
        element.on('keyup', (event) => event.stopPropagation());
        element.on('keypress', (event) => event.stopPropagation());

        function commit() {

          this.$rootScope.$broadcast('properties:property:commit', {
            name: name,
            value: ngModel.$modelValue }
          );
        }

        function onKeyDown(e) {

          switch(e.keyCode) {

            case 13: // enter

              e.preventDefault();
              element.blur();

              break;

            case 27: // esc

              e.preventDefault();
              ngModel.$rollbackViewValue();
              element.blur();
              break;
          }
        }

        element.on('keydown', (e) => scope.$apply(onKeyDown.call(this, e)));

        // When the model value changes, commit the value to database
        // However, we only want to do this when the value is changed through
        // the properties panel, as opposed to changes originating elsewhere
        // (e.g.: dragging a control updates the model value)
        // Therefore use a parser instead of a watch on ngModel.$modelValue.
        ngModel.$parsers.push((value) => {

          // Allow the value to pass through the parser pipeline first,
          // since the $modelValue hasn't been set yet
          $timeout(() => commit.call(this));

          return value;
        })
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = ($timeout: ng.ITimeoutService, $rootScope: ng.IRootScopeService) => new PropertyBindings($timeout, $rootScope);
      directive.$inject = ['$timeout', '$rootScope'];
      return directive;
    }
  }
}

angular
  .module('siteApp')
  .directive('propertyBindings', Higherframe.UI.PropertyBindings.factory());
