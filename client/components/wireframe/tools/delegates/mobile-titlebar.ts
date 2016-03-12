
module Higherframe.Wireframe.Tools.Delegates {

  export class MobileTitlebar extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Library.MobileTitlebar {

      var model = new Common.Data.Component(
        Common.Drawing.ComponentType[Common.Drawing.ComponentType.MobileTitlebar],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Library.MobileTitlebar(model);
    }
  }
}
