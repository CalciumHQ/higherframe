
module Higherframe.Wireframe {

  export interface IToolDelegate {

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Component;
    createGhost(point: paper.Point, size?: paper.Size);
    updateGhost(point: paper.Point, size?: paper.Size);
    removeGhost();
  }

  export abstract class ToolDelegate {

    protected ghost: Common.Drawing.Component.Component;

    public createGhost(point: paper.Point, size?: paper.Size) {

      this.ghost = this.create(point, size);
    }

    public updateGhost(point: paper.Point, size?: paper.Size) {

      if (!this.ghost) {

        return;
      }

      this.ghost.model.properties = angular.extend(
        this.ghost.model.properties,
        this.getProperties(point, size)
      );

      this.ghost.update();
    }

    public removeGhost() {

      this.ghost.remove();
      this.ghost = null;
    }

    abstract create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Component;

    protected getProperties(point: paper.Point, size?: paper.Size): Common.Data.IComponentProperties {

      // Get dimensions
      let width = size ? size.width : 100;
      let height = size ? size.height : 80;

      // Get the center point
      let center = {
        x: point.x + width / 2,
        y: point.y + height / 2
      };

      // Create the new model
      return {
        x: center.x,
        y: center.y,
        width: width,
        height: height,
        index: paper.project.activeLayer.children.length
      };
    }
  }
}
