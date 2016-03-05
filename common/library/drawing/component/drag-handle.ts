
module Common.Drawing.Component {

  export interface IDragHandle extends paper.Group {
    position: paper.Point;
    cursor?: string;
    getSnapPoints?: (position: paper.Point) => Array<SnapPoint>;
    onMove?: (position: paper.Point) => paper.Point;
  }

  export class DragHandle extends paper.Group implements IDragHandle {

    constructor(position: paper.Point, color: paper.Color) {

      super();

      var lineWidth = 1/paper.view.zoom;
      var handleSize = 3/paper.view.zoom;
      var handle = paper.Path.Rectangle(
        new paper.Point(position.x - handleSize, position.y - handleSize),
        new paper.Point(position.x + handleSize, position.y + handleSize)
      );

      handle.strokeColor = color;
      handle.strokeWidth = lineWidth;
      handle.fillColor = 'white';

      this.addChild(handle);
    }


    /**
     * Derived class should implement
     */

    cursor: string;

    getSnapPoints(position: paper.Point): Array<SnapPoint> {

      return [];
    }

    onMove(position: paper.Point): paper.Point {

      return position;
    }
  }
}
