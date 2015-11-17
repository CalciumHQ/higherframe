/// <reference path="../../../library/higherframe.ts"/>


module Higherframe.Controllers.Frame {

  export class PropertiesPaneController {

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
}

angular
  .module('siteApp')
  .controller('PropertiesCtrl', Higherframe.Controllers.Frame.PropertiesPaneController);
