
module Higherframe.Wireframe.Tools.Delegates {

  export class Browser extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 800;
    defaultHeight = 600;

    public drawCursor: string = '/assets/cursors/browser-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/browser-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/browser-place.png';
    public placeCursorHidpi: string = '/assets/cursors/browser-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Library.Browser {

      var model = new Common.Data.Component(
        Common.Drawing.ComponentType[Common.Drawing.ComponentType.Browser],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Library.Browser(model);
    }
  }
}
