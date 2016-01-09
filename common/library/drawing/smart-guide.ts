
module Common.Drawing {

  export enum SmartGuideAxis {
    X,
    Y
  }

  export class SmartGuide {

    origin: SnapPoint;
    relation: SnapPoint;
    axis: SmartGuideAxis;
    score: number;
    delta: {
      x: number,
      y: number
    };


    /**
     * Return a vector representing how far the origin point was adjusted`
     */

    getAdjustment(): paper.Point {

      if (this.axis == SmartGuideAxis.X) {

        return new paper.Point(this.delta.x, 0);
      }

      else {

        return new paper.Point(0, this.delta.y);
      }
    }


    /**
     * Return the origin point with the adjustment applied
     */

    getAdjustedOriginPoint(): paper.Point {

      return this.origin.point.add(this.getAdjustment());
    }
  }
}
