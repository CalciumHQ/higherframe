
module Higherframe.Wireframe.Tools.Delegates {

  export class Checkbox extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Checkbox {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Checkbox],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Component.Library.Checkbox(model);
    }
  }
}
