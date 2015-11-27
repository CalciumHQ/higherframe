/// <reference path="../../../library/higherframe.ts"/>


module Higherframe.Controllers.Frame {

  export class PropertiesPaneController {

    // Member variables
    public selection: Array<Higherframe.Drawing.Component.IComponent>;
    public models: Object;
    private isPreventingCommit: Boolean = false;

    constructor(private $scope: ng.IScope, private $rootScope: ng.IRootScopeService, private $timeout: ng.ITimeoutService) {

      $scope.$on('controller:component:selected', (event, components) => {

        this.setSelection(components);
      });
    }

    setSelection(selection: Array<Higherframe.Drawing.Component.IComponent>) {

      // Ensure a focussed control is committed before changing the selection
      // This is important for filling out a control, then clicking in the
      // canvas to select another control.
      var focussed = this.getFocussedControl();
      if (focussed) {

        this.commitControl(focussed);
      }

      // Set the new selection
      this.selection = selection;

      if (!this.selection || this.selection.length != 1) {

        return;
      }

      // Initialise a fresh set of models with the component's properties values
      // Also initialise the control
      this.models = {};
      this.selection[0].properties.forEach((property: any) => {

        property.controls.forEach((control: any) => {

          this.resetControl(control);
          control.focus = false;
        });
      });
    }

    getFocussedControl() {

      if (!this.selection || !this.selection.length) {

        return;
      }

      var c;
      this.selection[0].properties.forEach((property: any) => {

        property.controls.forEach((control: any) => {

          if (control.focus) { c = control; }
        });
      });
      return c;
    }

    preventCommit() {

      this.isPreventingCommit = true;
      this.$timeout(() => this.isPreventingCommit = false, 100);
    }

    commitControl(control) {

      if (this.isPreventingCommit) {

        return;
      }

      this.selection[0].model.properties[control.model] = this.models[control.model];
      this.$rootScope.$broadcast('properties:component:updated', { component: this.selection[0] });
    }

    resetControl(control) {

      this.models[control.model] = this.selection[0].model.properties[control.model];
    }

    onPropertyControlFocus(property) {

    }

    onPropertyControlBlur(control) {

      this.commitControl(control);
    }

    onPropertyControlKeydown(control, $event) {

      switch($event.keyCode) {

        case 13: // enter

          $event.preventDefault();
          $event.stopPropagation();

          control.focus = false;
          break;

        case 27: // esc

          $event.preventDefault();
          $event.stopPropagation();

          this.resetControl(control);
          this.preventCommit();
          control.focus = false;
          break;
      }
    }

    onPropertyControlChange(control, data) {

      // Save the updated control to database
      this.commitControl(control);
    }
  }
}

angular
  .module('siteApp')
  .controller('PropertiesCtrl', Higherframe.Controllers.Frame.PropertiesPaneController);
