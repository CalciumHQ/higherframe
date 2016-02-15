
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

        function commit() {

          this.$rootScope.$broadcast('properties:property:commit', {
            name: name,
            value: ngModel.$modelValue }
          );
        }

        function onModelChanged() {

          commit.call(this);
        }

        function onKeyDown(e) {

          switch(e.keyCode) {

            case 13: // enter

              e.preventDefault();
              e.stopPropagation();
              element.blur();

              break;

            case 27: // esc

              e.preventDefault();
              e.stopPropagation();

              ngModel.$rollbackViewValue();
              element.blur();
              break;
          }
        }

        scope.$watch(() => ngModel.$modelValue, () => onModelChanged.call(this));
        element.on('keydown', (e) => scope.$apply(onKeyDown.call(this, e)));
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
