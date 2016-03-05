module Higherframe.Wireframe {

  export class Tool extends paper.Tool {

    private rootScope: ng.IRootScopeService;
    private CanvasRegistry: Higherframe.Wireframe.CanvasRegistry;
    protected canvas: Higherframe.Wireframe.Canvas;

    constructor() {

      super();

      // Create an injector
      let $injector = angular.injector(['ng', 'siteApp.library']);

      // Get the canvas registry service
      $injector.invoke(($rootScope: ng.IRootScopeService, $interval: ng.IIntervalService, CanvasRegistry: Higherframe.Wireframe.CanvasRegistry) => {

        this.CanvasRegistry = CanvasRegistry;

        // Get the body element
        var bodyEl = angular.element(document.body),
          promise;

        // Some tools are registered in the config stage, where rootScope does
        // not yet exist
        // Check the body element until a root scope reference exists
        promise = $interval(() => {

          if (bodyEl.scope) {

            $interval.cancel(promise);
            this.rootScope = bodyEl.scope().$root;
            this.registerWatches();
          }
        }, 100);
      });
    }

    private registerWatches() {

      this.rootScope.$watch(() => this.CanvasRegistry.getCanvas(), (canvas) => {

        this.canvas = canvas;
      });
    }
  }
}
