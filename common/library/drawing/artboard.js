var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Higherframe;
(function (Higherframe) {
    var Drawing;
    (function (Drawing) {
        var Artboard = (function (_super) {
            __extends(Artboard, _super);
            function Artboard(model) {
                _super.call(this);
                this.hovered = false;
                this.active = false;
                this.focussed = false;
                this.name = model.name;
                this.width = model.width;
                this.height = model.height;
                this.left = model.left;
                this.top = model.top;
            }
            Artboard.prototype.update = function (canvas) {
                // Determine palette
                var theme = new Common.UI.DefaultTheme();
                var foreColor = theme.ComponentDefault;
                if (this.active) {
                    foreColor = theme.ComponentActive;
                }
                else if (this.focussed) {
                    foreColor = theme.ComponentFocus;
                }
                else if (this.hovered) {
                    foreColor = theme.ComponentHover;
                }
                // Remove old parts
                this.removeChildren();
                // The background
                var background = paper.Path.Rectangle(new paper.Point(this.left, this.top), new paper.Point(this.left + this.width, this.top + this.height));
                background.fillColor = 'white';
                if (canvas.editMode == Common.Drawing.EditMode.Artboards) {
                    background.strokeColor = foreColor;
                }
                else {
                    background.strokeColor = '#ccc';
                }
                background.strokeWidth = 1 / paper.view.zoom;
                this.addChild(background);
                // The artboard label
                var label = new paper.PointText({
                    point: background.bounds.topLeft.subtract(new paper.Point(0, 10 / paper.view.zoom)),
                    content: this.name,
                    fillColor: foreColor,
                    fontSize: 12 / paper.view.zoom,
                    fontFamily: 'Myriad Pro'
                });
                this.addChild(label);
            };
            return Artboard;
        })(paper.Group);
        Drawing.Artboard = Artboard;
    })(Drawing = Higherframe.Drawing || (Higherframe.Drawing = {}));
})(Higherframe || (Higherframe = {}));
//# sourceMappingURL=artboard.js.map