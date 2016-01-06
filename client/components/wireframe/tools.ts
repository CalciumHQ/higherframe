
module Higherframe.Wireframe {

  export interface ToolConfig {
    onMouseDown?: Function,
    onMouseUp?: Function,
    onMouseMove?: Function,
    onMouseDrag?: Function,
    onMouseWheel?: Function,
    onKeyDown?: Function
  }

  export class Tool extends paper.Tool {

    bind(config: ToolConfig, context: any) {

      if (config.onMouseDown) {

        this.onMouseDown = (event) => config.onMouseDown.call(context, event);
      }

      if (config.onMouseUp) {

        this.onMouseUp = (event) => config.onMouseUp.call(context, event);
      }

      if (config.onMouseMove) {

        this.onMouseMove = (event) => config.onMouseMove.call(context, event);
      }

      if (config.onMouseDrag) {

        this.onMouseDrag = (event) => config.onMouseDrag.call(context, event);
      }

      if (config.onMouseWheel) {

        (<any>$(context.element)).mousewheel((event) => config.onMouseWheel.call(context, event));
      }
    }
  }


  export module Tools {

    /**
     * Exposes a singleton tool for the draw edit mode
     */

    export class Draw {

      private static tool: Wireframe.Tool;

      public static get(): Wireframe.Tool {

        if (!Draw.tool) {

          Draw.tool = new Wireframe.Tool();
        }

        return Draw.tool;
      }
    }


    /**
     * Exposes a singleton tool for the artboards edit mode
     */

    export class Artboards {

      private static tool: Wireframe.Tool;

      public static get(): Wireframe.Tool {

        if (!Artboards.tool) {

          Artboards.tool = new Wireframe.Tool();
        }

        return Artboards.tool;
      }
    }
  }
}
