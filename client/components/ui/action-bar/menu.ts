
module Higherframe.UI.ActionBar {

  export class Menu implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    replace = false;

    // Member functions
    show(element: ng.IAugmentedJQuery) {

      element.addClass('active');

      let items = element.find('.action-menu-items');
      items.show();
    }

    hide(element: ng.IAugmentedJQuery) {

      element.removeClass('active');

      let items = element.find('.action-menu-items');
      items.hide();
    }

    constructor() {

      Menu.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {

        var open: Boolean = false;

        element.bind('click', () => {

          open = !open;

          if (open) {

            this.show(element);
          }

          else {

            this.hide(element);
          }
        });
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = () => new Menu();
      directive.$inject = [];
      return directive;
    }
  }
}

angular
  .module('siteApp')
  .directive('uiActionMenu', Higherframe.UI.ActionBar.Menu.factory());
