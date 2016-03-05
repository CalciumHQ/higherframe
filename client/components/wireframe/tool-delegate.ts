
module Higherframe.Wireframe {

  export interface IToolDelegate {

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Component;
    createGhost(topLeft: paper.Point, size?: paper.Size);
    updateGhost(point: paper.Point, size?: paper.Size);
    removeGhost();
  }

  export abstract class ToolDelegate {

    protected ghost: Common.Drawing.Component.Component;
    protected defaultWidth: number = 0;
    protected defaultHeight: number = 0;

    public createGhost(topLeft: paper.Point, size?: paper.Size) {

      if (this.ghost) {

        this.removeGhost();
      }

      this.ghost = this.create(topLeft, size);
      this.ghost.opacity = 0.3;
    }

    public createGhostWithCenter(center: paper.Point, size?: paper.Size) {

      let topLeft = new paper.Point(
        center.x - (size ? size.width : this.defaultWidth)/2,
        center.y - (size ? size.height : this.defaultHeight)/2
      );

      this.createGhost(topLeft, size);
    }

    public updateGhost(topLeft: paper.Point, size?: paper.Size) {

      if (!this.ghost) {

        return;
      }

      this.ghost.model.properties = angular.extend(
        this.ghost.model.properties,
        this.getProperties(topLeft, size)
      );

      this.ghost.update();
    }

    public updateGhostWithCenter(center: paper.Point, size?: paper.Size) {

      if (!this.ghost) {

        return;
      }

      let topLeft = new paper.Point(
        center.x - (size ? size.width : this.defaultWidth)/2,
        center.y - (size ? size.height : this.defaultHeight)/2
      );

      this.updateGhost(topLeft, size);
    }

    public removeGhost() {

      this.ghost.remove();
      this.ghost = null;
    }

    abstract create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component.Component;

    public createWithCenter(center: paper.Point, size?: paper.Size): Common.Drawing.Component.Component {

      if (!size) {

        size = new paper.Size(this.defaultWidth, this.defaultHeight);
      }

      let topLeft = new paper.Point(
        center.x - size.width/2,
        center.y - size.height/2
      );

      return this.create(topLeft, size);
    }

    protected getProperties(topleft: paper.Point, size?: paper.Size): Common.Data.IComponentProperties {

      // Get dimensions
      let width = size ? size.width : this.defaultWidth;
      let height = size ? size.height : this.defaultHeight;

      // Get the center point
      let center = {
        x: topleft.x + width / 2,
        y: topleft.y + height / 2
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
