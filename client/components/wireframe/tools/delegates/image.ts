
module Higherframe.Wireframe.Tools.Delegates {

  export class Image extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 160;
    defaultHeight = 130;

    public drawCursor: string = '/assets/cursors/image-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/image-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/image-place.png';
    public placeCursorHidpi: string = '/assets/cursors/image-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Image {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Image],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Component.Library.Image(model);
    }
  }
}
