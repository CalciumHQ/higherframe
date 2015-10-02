/// <reference path="../../higherframe.ts"/>

module Higherframe.UI {

  /**
   * The attributes which may be defined on a TrayRegionDirective.
   */

  export interface ITrayRegionAttributes extends ng.IAttributes {
    position: string
  }


  /**
   * The scope on a TrayRegionDirective.
   */

  export interface ITrayRegionScope extends ng.IScope {
    position: string
  }


  /**
   * Controller of the TrayRegionDirective directive.
   */

  export class TrayRegion {

    // Member variables
    position: string;
    tabIndex: number = 0;
    trays: Array<ITray> = [];

    constructor(
      private $scope: ITrayRegionScope,
      private TrayManager: Tray.Manager,
      private localStorageService
    ) {

      this.position = $scope.position;
      TrayManager.registerRegion(this);

      this.tabIndex = this.localStorageService.get(`ui.tray.${this.position}`) || 0;
    }

    onTabClick($index: number) {

      this.setActiveTray($index);
    }

    setActiveTray(index: number) {

      if (this.tabIndex == index) {

        this.tabIndex = -1;
      }

      else {

        this.tabIndex = index;
      }

      this.localStorageService.set(`ui.tray.${this.position}`, this.tabIndex);
    }
  }


  /**
   * Directive that creates a region which can house trays.
   */

  export class TrayRegionDirective implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    restrict = 'E';
    replace = true;
    transclude = true;
    templateUrl = '/library/ui/tray/region.html';
    controller = TrayRegion;
    controllerAs = 'region';
    scope = { position: '@' };

    constructor() {

      TrayRegionDirective.prototype.link = (scope: ITrayRegionScope, element: ng.IAugmentedJQuery, attrs: ITrayRegionAttributes) => {

        scope.position = attrs.position;
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = () => new TrayRegionDirective();
      directive.$inject = [];
      return directive;
    }
  }
}

angular.module('siteApp').directive('uiTrayRegion', Higherframe.UI.TrayRegionDirective.factory());
