
module Higherframe.UI {
  export class PropertyInputBindings implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'A';
    require = 'ngModel';

    isPreventingCommit: boolean = false;

    constructor(private $timeout: ng.ITimeoutService, private $rootScope: ng.IRootScopeService) {

      PropertyInputBindings.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

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

      const directive = ($timeout: ng.ITimeoutService, $rootScope: ng.IRootScopeService) => new PropertyInputBindings($timeout, $rootScope);
      directive.$inject = ['$timeout', '$rootScope'];
      return directive;
    }
  }

  export class PropertySliderBindings implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'A';
    require = 'ngModel';

    constructor(private $timeout: ng.ITimeoutService, private $rootScope: ng.IRootScopeService, private $parse: ng.IParseService) {

      PropertySliderBindings.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

        var name = (<any>attrs).propertyName;

        element.on('dragchange', (event, value) => scope.$apply(() => {

          sliderChangeHandler.bind(this)(value);
        }));

        element.on('dragend', (event, value) => scope.$apply(() => {

          sliderEndHandler.bind(this)(value);
        }));

        function commit() {

          $rootScope.$broadcast('properties:property:commit', {
            name: name,
            value: ngModel.$modelValue }
          );
        }

        function sliderChangeHandler(value) {

          this.$rootScope.$broadcast('properties:property:update');
        };

        function sliderEndHandler(value) {

          commit();
        };
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = ($timeout: ng.ITimeoutService, $rootScope: ng.IRootScopeService, $parse: ng.IParseService) => new PropertySliderBindings($timeout, $rootScope, $parse);
      directive.$inject = ['$timeout', '$rootScope', '$parse'];
      return directive;
    }
  }
}

angular
  .module('siteApp')
  .directive('propertyInputBindings', Higherframe.UI.PropertyInputBindings.factory())
  .directive('propertySliderBindings', Higherframe.UI.PropertySliderBindings.factory());
