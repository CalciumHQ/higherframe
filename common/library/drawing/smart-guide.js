var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        (function (SmartGuideAxis) {
            SmartGuideAxis[SmartGuideAxis["X"] = 0] = "X";
            SmartGuideAxis[SmartGuideAxis["Y"] = 1] = "Y";
        })(Drawing.SmartGuideAxis || (Drawing.SmartGuideAxis = {}));
        var SmartGuideAxis = Drawing.SmartGuideAxis;
        var SmartGuide = (function () {
            function SmartGuide() {
            }
            /**
             * Return a vector representing how far the origin point was adjusted`
             */
            SmartGuide.prototype.getAdjustment = function () {
                if (this.axis == SmartGuideAxis.X) {
                    return new paper.Point(this.delta.x, 0);
                }
                else {
                    return new paper.Point(0, this.delta.y);
                }
            };
            /**
             * Return the origin point with the adjustment applied
             */
            SmartGuide.prototype.getAdjustedOriginPoint = function () {
                return this.origin.point.add(this.getAdjustment());
            };
            return SmartGuide;
        })();
        Drawing.SmartGuide = SmartGuide;
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=smart-guide.js.map