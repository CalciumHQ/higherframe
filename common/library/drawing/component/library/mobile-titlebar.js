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
                var MobileTitlebar = (function (_super) {
                    __extends(MobileTitlebar, _super);
                    /**
                     * Create a new Mobile Titlebar component
                     */
                    function MobileTitlebar(model) {
                        _super.call(this, model);
                        // Implement IDefinition members
                        this.id = Drawing.Component.Type.Icon;
                        this.tags = [
                            'mobile',
                            'phone'
                        ];
                        this.properties = [
                            {
                                label: 'Title',
                                controls: [
                                    {
                                        model: 'title',
                                        type: String
                                    }
                                ]
                            },
                            {
                                label: 'Left icon',
                                controls: [
                                    {
                                        model: 'leftIcon',
                                        type: String,
                                        ui: 'icon',
                                        description: 'The icon to be displayed for the left action.'
                                    }
                                ]
                            },
                            {
                                label: 'Right icon',
                                controls: [
                                    {
                                        model: 'rightIcon',
                                        type: String,
                                        ui: 'icon',
                                        description: 'The icon to be displayed for the right action.'
                                    }
                                ]
                            }
                        ];
                        this.resizable = true;
                        this.showBounds = true;
                        var properties = this.getProperties();
                        properties.width = properties.width || 220;
                        properties.height = properties.height || 40;
                        properties.title = properties.title || 'Title';
                        // Perform the initial draw
                        this.update();
                    }
                    /**
                     * Redraw the component
                     */
                    MobileTitlebar.prototype.update = function () {
                        var properties = this.getProperties();
                        // Determine palette
                        var theme = new Common.UI.DefaultTheme();
                        var foreColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefault;
                        var borderColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.BorderDefault;
                        if (this.active) {
                            foreColor = theme.ComponentActive;
                            borderColor = theme.BorderActive;
                        }
                        else if (this.focussed) {
                            foreColor = theme.ComponentFocus;
                            borderColor = theme.BorderFocus;
                        }
                        else if (this.hovered) {
                            foreColor = theme.ComponentHover;
                            borderColor = theme.BorderHover;
                        }
                        // Remove the old parts
                        this.removeChildren();
                        var topLeft = new paper.Point(properties.x - properties.width / 2, properties.y - properties.height / 2);
                        var bottomRight = new paper.Point(properties.x + properties.width / 2, properties.y + properties.height / 2);
                        var bounds = new paper.Rectangle(topLeft, bottomRight);
                        // Draw the background
                        var background = paper.Path.Rectangle(bounds);
                        background.fillColor = 'rgba(0,0,0,0)';
                        this.addChild(background);
                        // Draw the title
                        var text = new paper.PointText({
                            point: new paper.Point(bounds.center.x, bounds.center.y + 4),
                            content: properties.title,
                            fillColor: foreColor,
                            fontSize: 14,
                            fontWeight: 600,
                            justification: 'center'
                        });
                        this.addChild(text);
                        // Draw the border
                        var borderStart = new paper.Point(bounds.bottomLeft);
                        var borderEnd = new paper.Point(bounds.bottomRight);
                        var border = paper.Path.Line(borderStart, borderEnd);
                        border.strokeColor = borderColor;
                        border.strokeWidth = 1.5;
                        this.addChild(border);
                        // Draw the left icon
                        if (properties.leftIcon) {
                            var leftIcon = new paper.PointText({
                                point: new paper.Point(bounds.leftCenter.x + 10, bounds.center.y + 5),
                                content: String.fromCharCode(parseInt(properties.leftIcon, 16)),
                                fillColor: foreColor,
                                fontSize: 16,
                                fontFamily: 'FontAwesome',
                                justification: 'left'
                            });
                            this.addChild(leftIcon);
                        }
                        // Draw the right icon
                        if (properties.rightIcon) {
                            var rightIcon = new paper.PointText({
                                point: new paper.Point(bounds.rightCenter.x - 10, bounds.center.y + 5),
                                content: String.fromCharCode(parseInt(properties.rightIcon, 16)),
                                fillColor: foreColor,
                                fontSize: 16,
                                fontFamily: 'FontAwesome',
                                justification: 'right'
                            });
                            this.addChild(rightIcon);
                        }
                    };
                    /**
                     * Update model with the state of the view component
                     */
                    MobileTitlebar.prototype.updateModel = function () {
                        var properties = this.getProperties();
                        properties.x = this.position.x;
                        properties.y = this.position.y;
                        properties.width = this.bounds.width;
                        properties.height = this.bounds.height;
                    };
                    /**
                     * Calculate the snap points for the component
                     */
                    MobileTitlebar.prototype.getSnapPoints = function () {
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
                    MobileTitlebar.prototype.getProperties = function () {
                        return this.model.properties;
                    };
                    MobileTitlebar.title = 'Mobile Titlebar';
                    MobileTitlebar.preview = '/assets/images/components/iphone-titlebar.svg';
                    MobileTitlebar.category = 'Mobile';
                    return MobileTitlebar;
                })(Drawing.Component.Base);
                Library.MobileTitlebar = MobileTitlebar;
            })(Library = Component.Library || (Component.Library = {}));
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=mobile-titlebar.js.map