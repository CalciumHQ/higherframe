
module Higherframe.Wireframe {

  export interface IToolDelegate {

    create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component;
    createGhost(topLeft: paper.Point, size?: paper.Size);
    updateGhost(point: paper.Point, size?: paper.Size);
    removeGhost();
  }

  export abstract class ToolDelegate {

    protected ghost: Common.Drawing.Component;
    protected defaultWidth: number = 0;
    protected defaultHeight: number = 0;

    public drawCursor: string = '/assets/cursors/checkbox-draw.png';
    public drawCursorHidpi: string = '/assets/cursors/checkbox-draw@2x.png';
    public drawCursorFallback: string = 'crosshair';
    public drawCursorFocus: string = '6 6';

    public placeCursor: string = '/assets/cursors/checkbox-place.png';
    public placeCursorHidpi: string = '/assets/cursors/checkbox-place@2x.png';
    public placeCursorFallback: string = 'default';
    public placeCursorFocus: string = '6 6';

    public createGhost(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Item {

      if (this.ghost) {

        this.removeGhost();
      }

      this.ghost = this.create(topLeft, size);
      this.ghost.opacity = 0.3;

      return this.ghost;
    }

    public createGhostWithCenter(center: paper.Point, size?: paper.Size): Common.Drawing.Item {

      let topLeft = new paper.Point(
        center.x - (size ? size.width : this.defaultWidth)/2,
        center.y - (size ? size.height : this.defaultHeight)/2
      );

      return this.createGhost(topLeft, size);
    }

    public updateGhost(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Item {

      if (!this.ghost) {

        return;
      }

      this.ghost.model.properties = angular.extend(
        this.ghost.model.properties,
        this.getProperties(topLeft, size)
      );

      this.ghost.update();
      return this.ghost;
    }

    public updateGhostWithCenter(center: paper.Point, size?: paper.Size): Common.Drawing.Item {

      if (!this.ghost) {

        return;
      }

      let topLeft = new paper.Point(
        center.x - (size ? size.width : this.defaultWidth)/2,
        center.y - (size ? size.height : this.defaultHeight)/2
      );

      return this.updateGhost(topLeft, size);
    }

    public removeGhost() {

      this.ghost.remove();
      this.ghost = null;
    }

    public getGhostPosition(): paper.Point {

      if (!this.ghost) {

        return null;
      }

      return this.ghost.bounds.center;
    }

    abstract create(topLeft: paper.Point, size?: paper.Size): Common.Drawing.Component;

    public createWithCenter(center: paper.Point, size?: paper.Size): Common.Drawing.Component {

      if (!size) {

        size = new paper.Size(this.defaultWidth, this.defaultHeight);
      }

      let topLeft = new paper.Point(
        center.x - size.width/2,
        center.y - size.height/2
      );

      return this.create(topLeft, size);
    }

    protected getProperties(topleft: paper.Point, size?: paper.Size): Common.Data.ComponentProperties {

      // Get dimensions
      let width = size ? size.width : this.defaultWidth;
      let height = size ? size.height : this.defaultHeight;

      // Get the center point
      let center = {
        x: topleft.x + width / 2,
        y: topleft.y + height / 2
      };

      // Create the new model
      return new Common.Data.ComponentProperties({
        x: center.x,
        y: center.y,
        width: width,
        height: height,
        index: paper.project.activeLayer.children.length,
        opacity: 100
      });
    }
  }
}
