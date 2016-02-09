/// <reference path="../../../library/higherframe.ts"/>


module Higherframe.Controllers.Frame {

  export class PropertiesPaneController {

    // Member variables
    public open: boolean = false;
    public pinned: boolean = false;
    public point: { x: number, y: number } = { x: 100, y: 200 };
    public tab: string = 'display';

    public selection: Array<Common.Drawing.Component.IComponent>;

    public models: Object;
    private isPreventingCommit: Boolean = false;

    constructor(
      private $scope: ng.IScope,
      private $rootScope: ng.IRootScopeService,
      private $timeout: ng.ITimeoutService,
      private $controller: ng.IControllerService,
      private $compile: ng.ICompileService
    ) {

      $scope.$on('controller:component:selected', (event, components) => {

        this.setSelection(components);
      });

      $scope.$on('controller:properties:open', (event, data) => {

        data = data || {};

        this.open = true;

        if (!this.pinned && data.point) {

          this.point = data.point;
        }
      });

      $scope.$on('controller:properties:close', (event, data) => {

        data = data || {};

        if (!this.pinned || data.force) {

          this.open = false;
        }
      });
    }

    public setSelection(selection: Array<Common.Drawing.Component.IComponent>) {

      // Ensure a focussed control is committed before changing the selection
      // This is important for filling out a control, then clicking in the
      // canvas to select another control.
      var focussed = this.getFocussedControl();
      if (focussed) {

        this.commitControl(focussed);
      }

      // Get the display tab element and empty
      let parent = angular.element('#properties-pane-display');
      parent.empty();

      // Set the new selection
      this.selection = selection;

      if (!this.selection || this.selection.length != 1) {

        return;
      }

      // Create a new scope
      var scope = <Higherframe.UI.Component.IPropertiesScope>this.$rootScope.$new();
      scope.properties = (<any>this.selection[0]).model.properties;

      // Create the properties page
      let html = `<div ng-controller="${ (<any>this.selection[0]).propertiesController }" ng-include="'${ (<any>this.selection[0]).propertiesTemplateUrl }'" />`;
      let el = this.$compile(html)(scope);
      el.appendTo(parent);

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

    public getFocussedControl() {

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

    public preventCommit() {

      this.isPreventingCommit = true;
      this.$timeout(() => this.isPreventingCommit = false, 100);
    }

    public commitControl(control) {

      if (this.isPreventingCommit) {

        return;
      }

      this.selection[0].model.properties[control.model] = this.models[control.model];
      this.$rootScope.$broadcast('properties:component:updated', { component: this.selection[0] });
    }

    public resetControl(control) {

      this.models[control.model] = this.selection[0].model.properties[control.model];
    }

    public onHeaderDrag($event) {

      this.point.x += $event.deltaX,
      this.point.y += $event.deltaY;
    }

    public onPropertyControlFocus(property) {

    }

    public onPropertyControlBlur(control) {

      this.commitControl(control);
    }

    public onPropertyControlKeydown(control, $event) {

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

    public onMediaPropertyControlChange(control, data) {

      // Inform the controller there is new media
      this.$rootScope.$broadcast('properties:media:added', { media: data.media });

      // TODO: Resize the control to natural dimensions
      // this.selection[0].properties.width = data.media.width;

      // Defer to regular handler
      this.onPropertyControlChange(control, data);
    }

    public onPropertyControlChange(control, data) {

      // Save the updated control to database
      this.commitControl(control);
    }
  }
}

angular
  .module('siteApp')
  .controller('PropertiesCtrl', Higherframe.Controllers.Frame.PropertiesPaneController);
