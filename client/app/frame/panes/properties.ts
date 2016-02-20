/// <reference path="../../../library/higherframe.ts"/>


module Higherframe.Controllers.Frame {

  export class PropertiesPaneController {

    // Member variables
    public open: boolean = this.localStorageService.get(`frame.properties.open`);
    public pinned: boolean = this.localStorageService.get(`frame.properties.pinned`);
    public point: { x: number, y: number } = this.localStorageService.get(`frame.properties.point`) || { x: 100, y: 200 };
    public tab: string = 'display';

    public selection: Array<Common.Drawing.Component.IComponent>;

    public models: Object;

    constructor(
      private $scope: ng.IScope,
      private $rootScope: ng.IRootScopeService,
      private $timeout: ng.ITimeoutService,
      private $controller: ng.IControllerService,
      private $compile: ng.ICompileService,
      private localStorageService
    ) {

      $scope.$on('controller:component:selected', (event, components) => {

        this.setSelection(components);
      });

      $scope.$on('controller:properties:open', (event, data) => {

        data = data || {};

        this.setOpen(true);

        if (!this.pinned && data.point) {

          this.point = data.point;
        }
      });

      $scope.$on('controller:properties:close', (event, data) => {

        data = data || {};

        if (!this.pinned || data.force) {

          this.setOpen(false);
        }
      });

      $scope.$on('properties:property:commit', (event, data) => {

        this.commitControl(data.name, data.value);
      });
    }

    public setOpen(open: boolean) {

      this.open = open;
      this.localStorageService.set(`frame.properties.open`, open);
    }

    public setPinned(pinned: boolean) {

      this.pinned = pinned;
      this.localStorageService.set(`frame.properties.pinned`, pinned);
    }

    public setPoint(point: { x: number, y: number }) {

      this.point = point;
      this.localStorageService.set(`frame.properties.point`, point);
    }

    public setSelection(selection: Array<Common.Drawing.Component.IComponent>) {

      // Ensure a focussed control is committed before changing the selection
      // This is important for filling out a control, then clicking in the
      // canvas to select another control.
      var focussed = this.getFocussedControl();
      if (focussed) {

        // this.commitControl(focussed);
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

    public commitControl(name, value) {

      this.selection[0].model.properties[name] = value;
      this.$rootScope.$broadcast('properties:component:updated', { component: this.selection[0] });
    }

    public onHeaderDrag($event) {

      var x = this.point.x + $event.deltaX;
      var y = this.point.y + $event.deltaY;

      this.setPoint({ x, y });
    }

    public onCloseClick() {

      this.setOpen(false);
    }

    public onPinClick() {

      this.setPinned(!this.pinned);
    }

    public onMediaPropertyControlChange(control, data) {

      // Inform the controller there is new media
      this.$rootScope.$broadcast('properties:media:added', { media: data.media });

      // TODO: Resize the control to natural dimensions
      // this.selection[0].properties.width = data.media.width;
    }
  }
}

angular
  .module('siteApp')
  .controller('PropertiesCtrl', Higherframe.Controllers.Frame.PropertiesPaneController);
