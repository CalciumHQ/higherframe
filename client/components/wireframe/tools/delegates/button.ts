
module Higherframe.Wireframe.Tools.Delegates {

  export class Button extends Higherframe.Wireframe.ToolDelegate implements Higherframe.Wireframe.IToolDelegate {

    defaultWidth = 160;
    defaultHeight = 32;
    
    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Library.Button {

      var model = new Common.Data.Component(
        Common.Drawing.Component.Type[Common.Drawing.Component.Type.Button],
        this.getProperties(topLeft, size)
      );

      return new Common.Drawing.Component.Library.Button(model);
    }
  }
}
