
module Higherframe.Wireframe.Tools.Delegates {

  export class Ellipse extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(point: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Ellipse {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Ellipse],
        this.getProperties(point, size)
      );

      return new Common.Drawing.Component.Library.Ellipse(model);
    }
  }
}
