
module Higherframe.UI {

  export interface TooltipScope extends ng.IScope {
    element: ng.IAugmentedJQuery,
    text: string,
  };

  export interface TooltipAttributes extends ng.IAttributes {
    uiTooltip: string,
  };

  export class TooltipController {

    tooltip: ng.IAugmentedJQuery;

    constructor(private $scope: TooltipScope, private $document: ng.IDocumentService, private $window: ng.IWindowService) {

      $scope.$watch('element', () => this.registerEvents());
    }

    private registerEvents() {

      this.$scope.element.bind('mouseover', () => this.onMouseOver());
      // this.$scope.element.bind('mouseout', () => this.onMouseOut());
    }

    private onMouseOver() {

      this.show();
    }

    private onMouseOut() {

      this.hide();
    }

    show() {

      if (this.tooltip) {

        return;
      }

      this.tooltip = angular.element(`<div class="uiTooltip"><span class="text">${this.$scope.text}</span></div>`);
      this.$document.find('body').eq(0).append(this.tooltip);

      // Start the positioning loop
      var self = this;
      (function loop() {

        if (!self.tooltip) {

          return;
        }

        // Position the tooltip
        self.position();

        // Request the next positioning loop
        self.$window.requestAnimationFrame(() => loop());
      })();
    }

    hide() {

      if (!this.tooltip) {

        return;
      }

      this.tooltip.remove();
      this.tooltip = null;
    }

    position() {

      if (!this.tooltip) {

        return;
      }

      // Get the position of the target element
      let targRect = this.$scope.element[0].getBoundingClientRect();
      let tooltipRect = this.tooltip[0].getBoundingClientRect();

      // Calculate position
      let top = targRect.top + (targRect.height - tooltipRect.height)/2;
      let left = targRect.right;

      // Position the tooltip
      this.tooltip.css('left', `${left}px`);
      this.tooltip.css('top', `${top}px`);
    }
  }

  export class Tooltip implements ng.IDirective {

    // Directive configuration
    link: (scope: TooltipScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
    restrict = 'A';
    replace = false;
    controller = TooltipController;
    controllerAs = 'Ctrl';

    constructor($parse: ng.IParseService) {

      Tooltip.prototype.link = (scope: TooltipScope, element: ng.IAugmentedJQuery, attrs: TooltipAttributes, ngModel: ng.INgModelController) => {

        scope.element = element;

        scope.$watch($parse(attrs.uiTooltip), (value: string) => {

          scope.text = value;
        });
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = ($parse: ng.IParseService) => new Tooltip($parse);
      directive.$inject = ['$parse'];
      return directive;
    }
  }
}

angular
  .module('siteApp')
  .directive('uiTooltip', Higherframe.UI.Tooltip.factory());
