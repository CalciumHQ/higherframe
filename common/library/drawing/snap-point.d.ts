declare module Common.Drawing {
    class SnapPoint {
        point: paper.Point;
        xName: string;
        yName: string;
        _weight: number;
        weight: number;
        constructor(point: paper.Point, xName: string, yName: string, weight?: number);
    }
}
