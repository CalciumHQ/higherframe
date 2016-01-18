/// <reference path="../../higherframe.ts"/>

module Higherframe.UI.Modal {

  export interface IModal {

    $scope: ng.IScope;
    title: String;
    templateUrl: String;
    element: ng.IAugmentedJQuery;

    close(): void;
    remove(): void;
  }

  export class Base {

    $scope: ng.IScope;
    element: ng.IAugmentedJQuery;

    close() {

      this.$scope.$emit('modal:close', this);
    }

    remove() {

      if (this.element) {

        this.element.remove();
      }
    }

    onKeyUp($event) {

      // esc key
      if ($event.keyCode == 27) {

        this.close();
      }
    }
  }
}
