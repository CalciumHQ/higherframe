var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        var Cursor = (function () {
            function Cursor() {
            }
            return Cursor;
        })();
        Drawing.Cursor = Cursor;
        ;
        var Cursors = (function () {
            function Cursors() {
            }
            Cursors.Default = 'default';
            Cursors.Pointer = 'pointer';
            Cursors.Move = 'move';
            Cursors.Crosshair = 'crosshair';
            Cursors.ResizeHorizontal = 'ew-resize';
            Cursors.ResizeVertical = 'ns-resize';
            Cursors.ResizeNESW = 'nesw-resize';
            Cursors.ResizeNWSE = 'nwse-resize';
            return Cursors;
        })();
        Drawing.Cursors = Cursors;
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=cursor.js.map