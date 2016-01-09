declare module Common.Drawing {
    enum SmartGuideAxis {
        X = 0,
        Y = 1,
    }
    class SmartGuide {
        origin: SnapPoint;
        relation: SnapPoint;
        axis: SmartGuideAxis;
        score: number;
        delta: {
            x: number;
            y: number;
        };
        /**
         * Return a vector representing how far the origin point was adjusted`
         */
        getAdjustment(): paper.Point;
        /**
         * Return the origin point with the adjustment applied
         */
        getAdjustedOriginPoint(): paper.Point;
    }
}
