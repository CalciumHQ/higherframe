
module Higherframe.UI {

  export interface IconScope extends ng.IScope {
    Ctrl: IconController
  };

  export class IconController {

    // Directive
    element: ng.IAugmentedJQuery;
    ngModel: ng.INgModelController;
    attrs: ng.IAttributes;

    // View variables
    icon: IFontAwesomeIcon;
    icons: Array<IFontAwesomeIcon> = Higherframe.UI.FontAwesome.getIcons();
    open: Boolean = false;
    search: String = '';
    searchFocus: Boolean = false;

    constructor(
      private $scope: ImageScope,
      private $http: ng.IHttpService,
      private $parse: ng.IParseService
    ) {}

    init(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) {

      this.initElement(element);
      this.initModel(ngModel);
      this.initAttributes(attrs);
    }

    private initModel(ngModel: ng.INgModelController) {

      // Initialise the preview with an existing value
      this.ngModel = ngModel;

      this.$scope.$watch(() => this.ngModel.$modelValue, () => {

        this.icon = this.ngModel.$modelValue;
      });
    }

    private initElement(element: ng.IAugmentedJQuery) {

      this.element = element;
    }

    private initAttributes(attrs: ng.IAttributes) {

      this.attrs = attrs;
    }


    /**
     * Event handlers
     */

    onRemoveClick() {

      this.ngModel.$setViewValue(null);

      // Call the provided change handler
      var attrHandler = this.$parse(this.attrs['uiIconChange']);
      attrHandler(this.$scope, { icon: this.ngModel.$modelValue });
    }

    onChangeClick($event) {

      $event.preventDefault();
      $event.stopPropagation();
      this.open = true;
    }

    onIconClick(icon: Higherframe.UI.IFontAwesomeIcon) {

      this.ngModel.$setViewValue(icon.unicode);

      // Call the provided change handler
      var attrHandler = this.$parse(this.attrs['uiIconChange']);
      attrHandler(this.$scope, { icon: this.ngModel.$modelValue });
    }

    onDropdownToggle(open: Boolean) {

      if (open) {

        this.searchFocus = true;
      }

      this.search = '';
    }

    onDropdownSearchClick($event: ng.IAngularEvent) {

      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  export class Icon implements ng.IDirective {

    // Directive configuration
    link: (scope: IconScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'E';
    replace = true;
    require = 'ngModel';
    templateUrl = 'components/ui/forms/icon.html';
    controller = IconController;
    controllerAs = 'Ctrl';

    constructor(private $http: ng.IHttpService) {

      Icon.prototype.link = (scope: IconScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

        scope.Ctrl.init(element, attrs, ngModel);
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = ($http: ng.IHttpService) => new Icon($http);
      directive.$inject = ['$http'];
      return directive;
    }
  }
}

angular
  .module('siteApp')
  .directive('uiIcon', Higherframe.UI.Icon.factory());
