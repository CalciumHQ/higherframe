
module Higherframe.Drawing {

  export class SnapPoint {

    point: paper.Point;
    name: string;

    _weight: number = 1;
    get weight(): number { return this._weight; }
    set weight(value: number) { this._weight = Math.max(0, Math.min(1, value)); }

    constructor(point: paper.Point, weight?: number, name?: string) {

      this.point = point;

      if (weight) {

        this.weight = weight;
      }

      if (name) {

        this.name = name;
      }
    }
  }
}
