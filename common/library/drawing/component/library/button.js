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
                var Button = (function (_super) {
                    __extends(Button, _super);
                    /**
                     * Create a new Button component
                     */
                    function Button(model) {
                        _super.call(this, model);
                        // Implement IDefinition members
                        this.id = Drawing.Component.Type.Button;
                        this.tags = [
                            'form'
                        ];
                        this.properties = [
                            {
                                label: 'Label',
                                controls: [
                                    {
                                        model: 'label',
                                        type: String,
                                        description: 'The text shown in the button.'
                                    }
                                ],
                            },
                            {
                                label: 'Type',
                                controls: [
                                    {
                                        model: 'type',
                                        type: 'String',
                                        ui: 'select',
                                        options: [
                                            {
                                                label: 'Primary',
                                                value: 'primary'
                                            },
                                            {
                                                label: 'Secondary',
                                                value: 'secondary'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                label: 'Font',
                                controls: [
                                    {
                                        model: 'fontWeight',
                                        type: Number,
                                        ui: 'select',
                                        options: [
                                            { label: 'Light', value: 300 },
                                            { label: 'Regular', value: 400 },
                                            { label: 'Bold', value: 700 }
                                        ],
                                        placeholder: 'Font weight',
                                        description: 'Set the font weight of the input.'
                                    }
                                ]
                            },
                            {
                                label: 'Corner radius',
                                controls: [
                                    {
                                        model: 'cornerRadius',
                                        type: Number,
                                        unit: 'px',
                                        description: 'The corner radius describes how rounded the corners should be.'
                                    }
                                ]
                            }
                        ];
                        var properties = this.getProperties();
                        properties.width = properties.width || 160;
                        properties.height = properties.height || 32;
                        properties.type = properties.type || 'primary';
                        properties.cornerRadius = properties.cornerRadius || 5;
                        properties.fontSize = properties.fontSize || 14;
                        properties.fontWeight = properties.fontWeight || 400;
                        // Perform the initial draw
                        this.update();
                    }
                    /**
                     * Redraw the component
                     */
                    Button.prototype.update = function () {
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
                        var topLeft = new paper.Point(properties.x, properties.y);
                        var bottomRight = new paper.Point(properties.x + properties.width, properties.y + properties.height);
                        var bounds = new paper.Rectangle(topLeft, bottomRight);
                        // Draw the shape
                        var shape = paper.Path.Rectangle(bounds, parseInt('' + properties.cornerRadius));
                        shape.strokeColor = foreColor;
                        shape.strokeWidth = 1.5;
                        if (properties.type == 'primary') {
                            shape.fillColor = backColor;
                        }
                        else {
                            shape.fillColor = 'rgba(0,0,0,0)';
                        }
                        // Draw the label
                        var label = new paper.PointText({
                            point: new paper.Point(bounds.center.x, bounds.center.y + properties.fontSize / 3),
                            content: properties.label,
                            fillColor: foreColor,
                            fontSize: properties.fontSize,
                            fontWeight: properties.fontWeight,
                            fontFamily: 'Myriad Pro',
                            justification: 'center'
                        });
                        // Group the parts as a component
                        this.addChild(shape);
                        this.addChild(label);
                    };
                    /**
                     * Update model with the state of the view component
                     */
                    Button.prototype.updateModel = function () {
                        var properties = this.getProperties();
                        properties.x = this.bounds.topLeft.x;
                        properties.y = this.bounds.topLeft.y;
                        properties.width = this.bounds.width;
                        properties.height = this.bounds.height;
                    };
                    /**
                     * Calculate the snap points for the component
                     */
                    Button.prototype.getSnapPoints = function () {
                        var properties = this.getProperties();
                        return [
                            new Drawing.SnapPoint(this.bounds.leftCenter, 'edge', 'center'),
                            new Drawing.SnapPoint(this.bounds.topCenter, 'center', 'edge'),
                            new Drawing.SnapPoint(this.bounds.rightCenter, 'edge', 'center'),
                            new Drawing.SnapPoint(this.bounds.bottomCenter, 'center', 'edge')
                        ];
                    };
                    /**
                     * Calculate the transform handles for the component
                     */
                    Button.prototype.getTransformHandles = function (color) {
                        var _this = this;
                        var topLeft = new Component.DragHandle(this.bounds.topLeft, color);
                        topLeft.cursor = Drawing.Cursors.ResizeNWSE;
                        topLeft.onMove = function (position) {
                            _this.bounds.topLeft = position;
                            return _this.bounds.topLeft;
                        };
                        var topCenter = new Component.DragHandle(this.bounds.topCenter, color);
                        topCenter.cursor = Drawing.Cursors.ResizeVertical;
                        topCenter.onMove = function (position) {
                            _this.bounds.topCenter.y = position.y;
                            return _this.bounds.topCenter;
                        };
                        var topRight = new Component.DragHandle(this.bounds.topRight, color);
                        topRight.cursor = Drawing.Cursors.ResizeNESW;
                        topRight.onMove = function (position) {
                            _this.bounds.topRight = position;
                            return _this.bounds.topRight;
                        };
                        var rightCenter = new Component.DragHandle(this.bounds.rightCenter, color);
                        rightCenter.cursor = Drawing.Cursors.ResizeHorizontal;
                        rightCenter.onMove = function (position) {
                            _this.bounds.rightCenter.x = position.x;
                            return _this.bounds.rightCenter;
                        };
                        var bottomRight = new Component.DragHandle(this.bounds.bottomRight, color);
                        bottomRight.cursor = Drawing.Cursors.ResizeNWSE;
                        bottomRight.onMove = function (position) {
                            _this.bounds.bottomRight = position;
                            return _this.bounds.bottomRight;
                        };
                        var bottomCenter = new Component.DragHandle(this.bounds.bottomCenter, color);
                        bottomCenter.cursor = Drawing.Cursors.ResizeVertical;
                        bottomCenter.onMove = function (position) {
                            _this.bounds.bottomCenter.y = position.y;
                            return _this.bounds.bottomCenter;
                        };
                        var bottomLeft = new Component.DragHandle(this.bounds.bottomLeft, color);
                        bottomLeft.cursor = Drawing.Cursors.ResizeNESW;
                        bottomLeft.onMove = function (position) {
                            _this.bounds.bottomLeft = position;
                            return _this.bounds.bottomLeft;
                        };
                        var leftCenter = new Component.DragHandle(this.bounds.leftCenter, color);
                        leftCenter.cursor = Drawing.Cursors.ResizeHorizontal;
                        leftCenter.onMove = function (position) {
                            _this.bounds.leftCenter.x = position.x;
                            return _this.bounds.leftCenter;
                        };
                        return [
                            topLeft,
                            topCenter,
                            topRight,
                            rightCenter,
                            bottomRight,
                            bottomCenter,
                            bottomLeft,
                            leftCenter
                        ];
                    };
                    ;
                    /**
                     * Cast the model properties into the correct type
                     */
                    Button.prototype.getProperties = function () {
                        return this.model.properties;
                    };
                    Button.title = 'Button';
                    Button.preview = '/assets/images/components/rectangle.svg';
                    Button.category = 'Form';
                    return Button;
                })(Drawing.Component.Base);
                Library.Button = Button;
            })(Library = Component.Library || (Component.Library = {}));
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=button.js.map