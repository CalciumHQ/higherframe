/// <reference path="../../../library/higherframe.ts"/>


module Higherframe.Controllers.Frame {

  export class PropertiesPaneController {

    // Member variables
    public open: boolean = true;
    public selection: Array<Common.Drawing.Component>;

    public models: Object;

    constructor(
      private $scope: ng.IScope,
      private $rootScope: ng.IRootScopeService,
      private $timeout: ng.ITimeoutService,
      private $controller: ng.IControllerService,
      private $compile: ng.ICompileService,
      private $window: ng.IWindowService,
      private localStorageService
    ) {

      $scope.$on('controller:component:selected', (event, components) => {

        this.setSelection(components);
      });

      $scope.$on('controller:properties:open', (event, data) => {

      });

      $scope.$on('controller:properties:close', (event, data) => {

      });

      $scope.$on('properties:property:commit', (event, data) => {

        this.commitControl(data.name, data.value);
      });
    }

    public setSelection(selection: Array<Common.Drawing.Component>) {

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

      // Initialise slider controls
      this.$timeout(() => {

        this.$scope.$broadcast('rzSliderForceRender');
      });
    }

    public commitControl(name, value) {

      this.selection[0].model.properties[name] = value;
      this.$rootScope.$broadcast('properties:component:updated', { component: this.selection[0] });
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
