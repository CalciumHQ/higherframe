
module Higherframe.Wireframe.Tools.Delegates {

  export class Button extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(point: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Button {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Button],
        this.getProperties(point, size)
      );

      return new Common.Drawing.Component.Library.Button(model);
    }
  }
}
