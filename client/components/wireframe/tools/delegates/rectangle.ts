
module Higherframe.Wireframe.Tools.Delegates {

  export class Rectangle extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(point: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Rectangle {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Rectangle],
        this.getProperties(point, size)
      );

      return new Common.Drawing.Component.Library.Rectangle(model);
    }
  }
}
