
module Higherframe.UI {

  export interface PlaceholderScope extends ng.IScope {
    type: string,
    src: string
  }

  export interface PlaceholderAttributes extends ng.IAttributes {
    uiPlaceholder: string,
  }

  export class PlaceholderController {

    type: string;
    src: string;

    constructor(private $scope: PlaceholderScope) {

      $scope.$watch('type', (value: string) => { this.type = value; });
      $scope.$watch('src', (value: string) => { this.src = value; });
    }
  }

  export class Placeholder implements ng.IDirective {

    // Directive configuration
    link: (scope: PlaceholderScope, element: ng.IAugmentedJQuery) => void;
    restrict = 'E';
    replace = true;
    controller = PlaceholderController;
    controllerAs = 'Ctrl';
    templateUrl = '/components/ui/placeholder/placeholder.html';
    scope = {
      type: '@',
      src: '='
    };

    constructor() {

      Placeholder.prototype.link = (scope: PlaceholderScope, element: ng.IAugmentedJQuery) => {

      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = () => new Placeholder();
      directive.$inject = [];
      return directive;
    }
  }
}

angular
  .module('siteApp')
  .directive('uiPlaceholder', Higherframe.UI.Placeholder.factory());
