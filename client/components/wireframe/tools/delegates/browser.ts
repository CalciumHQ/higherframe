
module Higherframe.Wireframe.Tools.Delegates {

  export class Browser extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(point: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Browser {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Browser],
        this.getProperties(point, size)
      );

      return new Common.Drawing.Component.Library.Browser(model);
    }
  }
}
