
module Higherframe.Wireframe.Tools.Delegates {

  export class MobileDevice extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 232;
    defaultHeight = 464;

    public drawCursor: string = '/assets/cursors/mobile-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/mobile-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/mobile-place.png';
    public placeCursorHidpi: string = '/assets/cursors/mobile-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Library.MobileDevice {

      var model = new Common.Data.Component(
        Common.Drawing.ComponentType[Common.Drawing.ComponentType.MobileDevice],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Library.MobileDevice(model);
    }
  }
}
