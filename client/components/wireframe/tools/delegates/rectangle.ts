
module Higherframe.Wireframe.Tools.Delegates {

  export class Rectangle extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 160;
    defaultHeight = 130;

    public drawCursor: string = '/assets/cursors/rectangle-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/rectangle-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/rectangle-place.png';
    public placeCursorHidpi: string = '/assets/cursors/rectangle-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Library.Rectangle {

      var model = new Common.Data.Component(
        Common.Drawing.ComponentType[Common.Drawing.ComponentType.Rectangle],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Library.Rectangle(model);
    }
  }
}
