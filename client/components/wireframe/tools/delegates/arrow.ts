
module Higherframe.Wireframe.Tools.Delegates {

  export class Arrow extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Library.Arrow {

      var properties = <Common.Data.IArrowProperties>this.getProperties(topLeft, size);

      properties.start = topLeft;

      var model = new Common.Data.Component(
        Common.Drawing.ComponentType[Common.Drawing.ComponentType.Arrow],
        properties
      );

      return new Common.Drawing.Library.Arrow(model);
    }
  }
}
