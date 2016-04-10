
module Common.Drawing {

  export enum DragHandleAxis {
    X,
    Y,
    Both
  }

  export class DragHandle extends paper.Group {

    public anchor: paper.Point;
    public hovered: boolean = false;
    public cursor: string;
    public axis: DragHandleAxis = DragHandleAxis.Both;

    constructor(anchor: paper.Point) {

      super();
      this.anchor = anchor;

      this.update();
    }

    update() {

      let theme: Common.UI.ITheme = new Common.UI.DefaultTheme();

      this.removeChildren();

      var lineWidth = 1/paper.view.zoom;
      let handleSize = 4/paper.view.zoom;
      let handleRect = new paper.Rectangle(
        new paper.Point(this.anchor.x - handleSize, this.anchor.y - handleSize),
        new paper.Point(this.anchor.x + handleSize, this.anchor.y + handleSize)
      );
      let handle = paper.Path.Ellipse(handleRect);

      handle.strokeColor = theme.ComponentHover;
      handle.strokeWidth = lineWidth;

      if (this.hovered) {

        handle.fillColor = theme.ComponentHover;
      }

      else {

        handle.fillColor = 'white';
      }

      this.addChild(handle);
    }


    /**
     * Derived class should implement
     */

    getSnapPoints(position: paper.Point): Array<SnapPoint> {

      return [];
    }

    onMove(position: paper.Point): paper.Point {

      return position;
    }
  }
}
