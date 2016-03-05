
module Higherframe.Wireframe.Tools.Delegates {

  export class Checkbox extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    public drawCursor: string = '/assets/cursors/checkbox-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/checkbox-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/checkbox-place.png';
    public placeCursorHidpi: string = '/assets/cursors/checkbox-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';
    
    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Checkbox {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Checkbox],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Component.Library.Checkbox(model);
    }
  }
}
