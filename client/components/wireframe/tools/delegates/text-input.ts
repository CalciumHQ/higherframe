
module Higherframe.Wireframe.Tools.Delegates {

  export class TextInput extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 160;
    defaultHeight = 32;

    public drawCursor: string = '/assets/cursors/text-input-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/text-input-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/text-input-place.png';
    public placeCursorHidpi: string = '/assets/cursors/text-input-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.TextInput {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.TextInput],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Component.Library.TextInput(model);
    }
  }
}
