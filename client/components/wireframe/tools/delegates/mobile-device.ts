
module Higherframe.Wireframe.Tools.Delegates {

  export class MobileDevice extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 232;
    defaultHeight = 464;

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.MobileDevice {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.MobileDevice],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Component.Library.MobileDevice(model);
    }
  }
}
