var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        var SnapPoint = (function () {
            function SnapPoint(point, xName, yName, weight) {
                this._weight = 1;
                this.point = point;
                this.xName = xName;
                this.yName = yName;
                if (weight) {
                    this.weight = weight;
                }
            }
            Object.defineProperty(SnapPoint.prototype, "weight", {
                get: function () { return this._weight; },
                set: function (value) { this._weight = Math.max(0, value); },
                enumerable: true,
                configurable: true
            });
            return SnapPoint;
        })();
        Drawing.SnapPoint = SnapPoint;
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=snap-point.js.map