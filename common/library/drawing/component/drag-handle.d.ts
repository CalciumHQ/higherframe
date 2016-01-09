declare module Common.Drawing.Component {
    interface IDragHandle extends paper.Group {
        position: paper.Point;
        cursor?: Cursor;
        getSnapPoints?: (position: paper.Point) => Array<SnapPoint>;
        onMove?: (position: paper.Point) => paper.Point;
    }
    class DragHandle extends paper.Group implements IDragHandle {
        constructor(position: paper.Point, color: paper.Color);
        /**
         * Derived class should implement
         */
        cursor: Cursor;
        getSnapPoints(position: paper.Point): Array<SnapPoint>;
        onMove(position: paper.Point): paper.Point;
    }
}
