
module Higherframe.Wireframe.Tools.Delegates {

  export class Ellipse extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 130;
    defaultHeight = 130;

    public drawCursor: string = '/assets/cursors/ellipse-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/ellipse-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/ellipse-place.png';
    public placeCursorHidpi: string = '/assets/cursors/ellipse-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Ellipse {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Ellipse],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Component.Library.Ellipse(model);
    }
  }
}
