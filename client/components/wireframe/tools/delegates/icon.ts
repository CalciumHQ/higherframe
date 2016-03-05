
module Higherframe.Wireframe.Tools.Delegates {

  export class Icon extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Icon {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Icon],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Component.Library.Icon(model);
    }
  }
}
