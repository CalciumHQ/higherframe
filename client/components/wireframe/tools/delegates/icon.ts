
module Higherframe.Wireframe.Tools.Delegates {

  export class Icon extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Library.Icon {

      var model = new Common.Data.Component(
        Common.Drawing.ComponentType[Common.Drawing.ComponentType.Icon],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Library.Icon(model);
    }
  }
}
