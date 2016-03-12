
module Higherframe.Wireframe.Tools.Delegates {

  export class SelectInput extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 160;
    defaultHeight = 32;

    public drawCursor: string = '/assets/cursors/select-input-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/select-input-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/select-input-place.png';
    public placeCursorHidpi: string = '/assets/cursors/select-input-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Library.SelectInput {

      var model = new Common.Data.Component(
        Common.Drawing.ComponentType[Common.Drawing.ComponentType.SelectInput],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Library.SelectInput(model);
    }
  }
}
