
module Higherframe.Wireframe.Tools {

  export class Draw extends paper.Tool {

    private static tool: Wireframe.Tools.Draw;


    /**
     * Exposes a singleton tool for the draw edit mode
     */

    public static get(context?): Wireframe.Tools.Draw {

      if (!Draw.tool) {

        Draw.tool = new Wireframe.Tools.Draw();
      }

      return Draw.tool;
    }
  }
}
