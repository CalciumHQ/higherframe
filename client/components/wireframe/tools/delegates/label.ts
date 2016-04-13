
module Higherframe.Wireframe.Tools.Delegates {

  export class Label extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    public drawCursor: string = '/assets/cursors/text-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/text-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/text-place.png';
    public placeCursorHidpi: string = '/assets/cursors/text-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Library.Label {

      var properties = <Common.Data.LabelProperties>this.getProperties(topLeft, size);

      if (!size) {

        properties.area = false;
        properties.width = 200;
        properties.height = 150;
      }

      var model = new Common.Data.Component(
        Common.Drawing.ComponentType[Common.Drawing.ComponentType.Label],
        properties
      );

      return new Common.Drawing.Library.Label(model);
    }

    createWithCenter(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Library.Label {

      return this.create(topLeft);
    }
  }
}
