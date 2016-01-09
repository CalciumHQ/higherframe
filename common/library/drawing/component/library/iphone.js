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
            var Library;
            (function (Library) {
                var IPhone = (function (_super) {
                    __extends(IPhone, _super);
                    /**
                     * Create a new iPhone component
                     */
                    function IPhone(model) {
                        _super.call(this, model);
                        // Implement IDefinition members
                        this.id = Drawing.Component.Type.IPhone;
                        this.tags = [
                            'container',
                            'apple',
                            'phone'
                        ];
                        this.properties = [];
                        // Perform the initial draw
                        this.update();
                    }
                    /**
                     * Redraw the component
                     */
                    IPhone.prototype.update = function () {
                        var WIDTH = 232;
                        var HEIGHT = 464;
                        // Determine palette
                        var theme = new Common.UI.DefaultTheme();
                        var foreColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefault;
                        if (this.active) {
                            foreColor = theme.ComponentActive;
                        }
                        else if (this.focussed) {
                            foreColor = theme.ComponentFocus;
                        }
                        else if (this.hovered) {
                            foreColor = theme.ComponentHover;
                        }
                        // Remove the old parts
                        this.removeChildren();
                        var topLeft = new paper.Point(this.model.properties.x - WIDTH / 2, this.model.properties.y - HEIGHT / 2);
                        var bottomRight = new paper.Point(this.model.properties.x + WIDTH / 2, this.model.properties.y + HEIGHT / 2);
                        var bounds = new paper.Rectangle(topLeft, bottomRight);
                        // Draw the outer frame
                        var outer = paper.Path.Rectangle(bounds, 20);
                        outer.strokeColor = foreColor;
                        outer.strokeWidth = 1.5;
                        outer.fillColor = 'rgba(255,255,255,0)';
                        // Draw the screen
                        var screenRectangle = new paper.Rectangle(new paper.Point(bounds.left + 6, bounds.top + 48), new paper.Point(bounds.right - 6, bounds.bottom - 70));
                        var screen = paper.Path.Rectangle(screenRectangle, 2);
                        screen.strokeColor = foreColor;
                        screen.strokeWidth = 1.5;
                        // Draw the button
                        var buttonposition = new paper.Point(this.model.properties.x, bounds.bottom - 35);
                        var button = paper.Path.Circle(buttonposition, 24);
                        button.strokeColor = foreColor;
                        button.strokeWidth = 1.5;
                        // Draw the speaker
                        var speakerRectangle = new paper.Rectangle(new paper.Point(this.model.properties.x - 23, bounds.top + 27), new paper.Point(this.model.properties.x + 23, bounds.top + 33));
                        var speaker = paper.Path.Rectangle(speakerRectangle, 3);
                        speaker.strokeColor = foreColor;
                        speaker.strokeWidth = 1.5;
                        // Draw the camera
                        var cameraposition = new paper.Point(this.model.properties.x, bounds.top + 18);
                        var camera = paper.Path.Circle(cameraposition, 4);
                        camera.strokeColor = foreColor;
                        camera.strokeWidth = 1.5;
                        // Group the parts as a component
                        this.addChild(outer);
                        this.addChild(screen);
                        this.addChild(button);
                        this.addChild(camera);
                        this.addChild(speaker);
                    };
                    /**
                     * Update model with the state of the view component
                     */
                    IPhone.prototype.updateModel = function () {
                        this.model.properties.x = this.position.x;
                        this.model.properties.y = this.position.y;
                    };
                    /**
                     * Calculate the snap points for the component
                     */
                    IPhone.prototype.getSnapPoints = function () {
                        return [
                            // Screen corners
                            new Drawing.SnapPoint(this.position.add(new paper.Point({ x: -116, y: -232 })), 'corner', 'corner', 1.5),
                            new Drawing.SnapPoint(this.position.add(new paper.Point({ x: 116, y: -232 })), 'corner', 'corner', 1.5),
                            new Drawing.SnapPoint(this.position.add(new paper.Point({ x: 116, y: 232 })), 'corner', 'corner', 1.5),
                            new Drawing.SnapPoint(this.position.add(new paper.Point({ x: -116, y: 232 })), 'corner', 'corner', 1.5),
                            // Inner screen corners
                            new Drawing.SnapPoint(this.position.add(new paper.Point({ x: -110, y: -184 })), 'inner corner', 'inner corner', 0.8),
                            new Drawing.SnapPoint(this.position.add(new paper.Point({ x: 110, y: -184 })), 'inner corner', 'inner corner', 0.8),
                            new Drawing.SnapPoint(this.position.add(new paper.Point({ x: 110, y: 162 })), 'inner corner', 'inner corner', 0.8),
                            new Drawing.SnapPoint(this.position.add(new paper.Point({ x: -110, y: 162 })), 'inner corner', 'inner corner', 0.8)
                        ];
                    };
                    IPhone.title = 'iPhone';
                    IPhone.preview = '/assets/images/components/iphone.svg';
                    IPhone.category = 'Containers';
                    return IPhone;
                })(Drawing.Component.Base);
                Library.IPhone = IPhone;
            })(Library = Component.Library || (Component.Library = {}));
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=iphone.js.map