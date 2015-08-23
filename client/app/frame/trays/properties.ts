/// <reference path="../../../library/higherframe.ts"/>

module Higherframe.Controllers.Frame {

  export class PropertiesTrayController {

    // Member variables
    private selection: Array<Higherframe.Drawing.Component.IComponent>;
    private hint: { title: String, description: String};

    constructor($scope: ng.IScope) {

      $scope.$on('controller:component:selected', (event, components) => {

        this.setSelection(components);
      });
    }

    setSelection(selection: Array<Higherframe.Drawing.Component.IComponent>) {

      this.selection = selection;
    }

    onPropertyFocus(property) {

      this.hint = {
        title: property.label,
        description: property.description
      };
    }

    onPropertyBlur() {

      this.hint = {
        title: '',
        description: ''
      };
    }
  }

  export class PropertiesTray implements Higherframe.UI.ITray {

    // ITray interface members
    label = 'Properties';
    templateUrl = '/app/frame/trays/properties.html';
    controller = PropertiesTrayController;
  }
}
