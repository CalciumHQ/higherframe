module Higherframe.Wireframe {

  export class Tool extends paper.Tool {

    protected canvas: Higherframe.Wireframe.Canvas;

    constructor() {

      super();

      // Create an injector
      let $injector = angular.injector(['ng', 'siteApp.library']);

      // Get the canvas registry service
      $injector.invoke(($rootScope: ng.IRootScopeService, CanvasRegistry: Higherframe.Wireframe.CanvasRegistry) => {

        var rootScope = angular.element(document.body).scope().$root;
        rootScope.$watch(() => CanvasRegistry.getCanvas(), (canvas) => {

          this.canvas = canvas;
        });
      });
    }
  }
}
