
module Higherframe.Wireframe {

  export class CanvasRegistry {

    setCanvas(canvas: Canvas) {

      (<any>window)._canvas = canvas;
    }

    getCanvas(): Canvas {

      return (<any>window)._canvas;
    }
  }
}

angular
  .module('siteApp.library')
  .service('CanvasRegistry', Higherframe.Wireframe.CanvasRegistry);
