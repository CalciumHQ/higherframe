
module Higherframe.UI {

  export interface AutocompleteScope extends ng.IScope {
    ngModel: ng.INgModelController,
  };

  export class AutocompleteController {

    query: String = '';
    options: Array<any> = [];
    open: Boolean = false;

    constructor(private $scope: AutocompleteScope, private $http: ng.IHttpService) {

      this.registerWatches();
    }

    private initModelController() {

      this.$scope.ngModel.$formatters.push(this.format);
      this.$scope.ngModel.$parsers.push(this.parse);
    }

    registerWatches() {

      this.$scope.$watch(() => this.$scope.ngModel, () => this.initModelController());
      this.$scope.$watch(() => this.query, () => this.getResults(this.query));
    }

    getResults(query: String) {

      if (query.length < 3) {

        this.clearResults();
        return;
      }

      this.$http
        .get('/api/users/query', { params: { q: query } })
        .success((results: Array<any>) => {

          this.options = results;
          this.open = true;
        });
    }

    clearResults() {

      this.options = [];
    }

    format(value) {

      return value;
    }

    parse(value) {

      return value;
    }

    render(value) {

    }

    onOptionClick(option) {

      this.$scope.ngModel.$setViewValue(option._id);
      this.open = false;
      this.query = '';
    }
  }

  export class Autocomplete implements ng.IDirective {

    // Directive configuration
    link: (scope: AutocompleteScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'E';
    replace = true;
    require = 'ngModel';
    templateUrl = '/components/ui/forms/autocomplete.html';
    controller = AutocompleteController;
    controllerAs = 'Ctrl';

    constructor(private $http: ng.IHttpService) {

      Autocomplete.prototype.link = (scope: AutocompleteScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

        scope.ngModel = ngModel;
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = ($http: ng.IHttpService) => new Autocomplete($http);
      directive.$inject = ['$http'];
      return directive;
    }
  }
}

angular
  .module('siteApp')
  .directive('uiAutocomplete', Higherframe.UI.Autocomplete.factory());
