var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        var Component;
        (function (Component) {
            var DragHandle = (function (_super) {
                __extends(DragHandle, _super);
                function DragHandle(position, color) {
                    _super.call(this);
                    var lineWidth = 1 / paper.view.zoom;
                    var handleSize = 3 / paper.view.zoom;
                    var handle = paper.Path.Rectangle(new paper.Point(position.x - handleSize, position.y - handleSize), new paper.Point(position.x + handleSize, position.y + handleSize));
                    handle.strokeColor = color;
                    handle.strokeWidth = lineWidth;
                    handle.fillColor = 'white';
                    this.addChild(handle);
                }
                DragHandle.prototype.getSnapPoints = function (position) {
                    return [];
                };
                DragHandle.prototype.onMove = function (position) {
                    return position;
                };
                return DragHandle;
            })(paper.Group);
            Component.DragHandle = DragHandle;
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=drag-handle.js.map