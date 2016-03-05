
module Higherframe.Wireframe.Tools.Delegates {

  export class Button extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 160;
    defaultHeight = 32;

    public drawCursor: string = '/assets/cursors/button-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/button-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/button-place.png';
    public placeCursorHidpi: string = '/assets/cursors/button-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Button {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Button],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Component.Library.Button(model);
    }
  }
}
