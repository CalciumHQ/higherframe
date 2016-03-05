
module Higherframe.Wireframe.Tools.Delegates {

  export class Label extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(point: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Label {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Label],
        this.getProperties(point, size)
      );

      return new Common.Drawing.Component.Library.Label(model);
    }
  }
}
