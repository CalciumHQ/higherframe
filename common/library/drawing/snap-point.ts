
module Common.Drawing {

  export class SnapPoint {

    point: paper.Point;
    xName: string;
    yName: string;

    _weight: number = 1;
    get weight(): number { return this._weight; }
    set weight(value: number) { this._weight = Math.max(0, value); }

    constructor(point: paper.Point, xName: string, yName: string, weight?: number) {

      this.point = point;
      this.xName = xName;
      this.yName = yName;

      if (weight) {

        this.weight = weight;
      }
    }
  }
}
