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
                var Icon = (function (_super) {
                    __extends(Icon, _super);
                    /**
                     * Create a new Icon component
                     */
                    function Icon(model) {
                        _super.call(this, model);
                        // Implement IDefinition members
                        this.id = Drawing.Component.Type.Icon;
                        this.tags = [
                            'basic',
                            'image',
                            'picture'
                        ];
                        this.properties = [
                            {
                                label: 'Icon',
                                controls: [
                                    {
                                        model: 'icon',
                                        type: String,
                                        ui: 'icon',
                                        description: 'The icon to be displayed.'
                                    }
                                ]
                            },
                            {
                                label: 'Size',
                                controls: [
                                    {
                                        model: 'fontSize',
                                        type: Number
                                    }
                                ]
                            }
                        ];
                        var properties = this.getProperties();
                        properties.width = properties.width || 32;
                        properties.height = properties.height || 32;
                        properties.fontSize = properties.fontSize || 32;
                        // Perform the initial draw
                        this.update();
                    }
                    /**
                     * Redraw the component
                     */
                    Icon.prototype.update = function () {
                        var properties = this.getProperties();
                        // Determine palette
                        var theme = new Common.UI.DefaultTheme();
                        var foreColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefault;
                        var backColor = theme.ShadingDefault;
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
                        var topLeft = new paper.Point(properties.x - properties.width / 2, properties.y - properties.height / 2);
                        var bottomRight = new paper.Point(properties.x + properties.width / 2, properties.y + properties.height / 2);
                        var bounds = new paper.Rectangle(topLeft, bottomRight);
                        // Draw the placeholder or the icon
                        if (!properties.icon) {
                            var shape = paper.Path.Rectangle(bounds);
                            shape.strokeColor = foreColor;
                            shape.strokeWidth = 1.5;
                            shape.fillColor = 'rgba(0,0,0,0)';
                            this.addChild(shape);
                            var crossOne = new paper.Path();
                            crossOne.add(bounds.topLeft);
                            crossOne.add(bounds.bottomRight);
                            crossOne.strokeColor = foreColor;
                            crossOne.strokeWidth = 1.5;
                            this.addChild(crossOne);
                            var crossTwo = new paper.Path();
                            crossTwo.add(bounds.topRight);
                            crossTwo.add(bounds.bottomLeft);
                            crossTwo.strokeColor = foreColor;
                            crossTwo.strokeWidth = 1.5;
                            this.addChild(crossTwo);
                        }
                        else {
                            // Draw the text
                            this.icon = new paper.PointText({
                                point: new paper.Point(properties.x, properties.y + properties.fontSize / 3),
                                content: String.fromCharCode(parseInt(properties.icon, 16)),
                                fillColor: foreColor,
                                fontSize: properties.fontSize,
                                fontFamily: 'FontAwesome',
                                justification: 'center'
                            });
                            this.addChild(this.icon);
                        }
                    };
                    /**
                     * Update model with the state of the view component
                     */
                    Icon.prototype.updateModel = function () {
                        var properties = this.getProperties();
                        properties.x = this.icon ? this.icon.point.x : this.bounds.center.x;
                        properties.y = this.icon ? this.icon.point.y - properties.fontSize / 3 : this.bounds.center.y;
                        properties.width = this.bounds.width;
                        properties.height = this.bounds.height;
                    };
                    /**
                     * Calculate the snap points for the component
                     */
                    Icon.prototype.getSnapPoints = function () {
                        var properties = this.getProperties();
                        return [
                            new Drawing.SnapPoint(this.bounds.leftCenter, 'edge', 'center'),
                            new Drawing.SnapPoint(this.bounds.topCenter, 'center', 'edge'),
                            new Drawing.SnapPoint(this.bounds.rightCenter, 'edge', 'center'),
                            new Drawing.SnapPoint(this.bounds.bottomCenter, 'center', 'edge')
                        ];
                    };
                    /**
                     * Cast the model properties into the correct type
                     */
                    Icon.prototype.getProperties = function () {
                        return this.model.properties;
                    };
                    Icon.title = 'Icon';
                    Icon.preview = '/assets/images/components/rectangle.svg';
                    Icon.category = 'Basic';
                    return Icon;
                })(Drawing.Component.Base);
                Library.Icon = Icon;
            })(Library = Component.Library || (Component.Library = {}));
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=icon.js.map