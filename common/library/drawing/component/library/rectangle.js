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
                var Rectangle = (function (_super) {
                    __extends(Rectangle, _super);
                    /**
                     * Create a new Rectangle component
                     */
                    function Rectangle(model) {
                        _super.call(this, model);
                        // Implement IDefinition members
                        this.id = Drawing.Component.Type.Rectangle;
                        this.tags = [
                            'basic',
                            'shape',
                            'flowchart'
                        ];
                        this.properties = [
                            {
                                label: 'Dimension',
                                controls: [
                                    {
                                        model: 'width',
                                        placeholder: 'Width',
                                        type: Number,
                                        description: 'The width of the rectangle.'
                                    },
                                    {
                                        model: 'height',
                                        placeholder: 'Height',
                                        type: Number,
                                        description: 'The height of the rectangle.'
                                    }
                                ]
                            },
                            {
                                label: 'Radius',
                                controls: [
                                    {
                                        model: 'cornerRadius',
                                        type: Number,
                                        description: 'The corner radius describes how rounded the corners should be.'
                                    }
                                ]
                            }
                        ];
                        var properties = this.model.properties;
                        properties.width = properties.width || 160;
                        properties.height = properties.height || 120;
                        properties.cornerRadius = properties.cornerRadius || 0;
                        // Perform the initial draw
                        this.update();
                    }
                    /**
                     * Redraw the component
                     */
                    Rectangle.prototype.update = function () {
                        var properties = this.model.properties;
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
                        var topLeft = new paper.Point(properties.x, properties.y);
                        var bottomRight = new paper.Point(properties.x + properties.width, properties.y + properties.height);
                        var bounds = new paper.Rectangle(topLeft, bottomRight);
                        // Draw the shape
                        var shape = paper.Path.Rectangle(bounds, parseInt('' + properties.cornerRadius));
                        shape.strokeColor = foreColor;
                        shape.strokeWidth = 1.5;
                        shape.fillColor = 'rgba(0,0,0,0)';
                        // Group the parts as a component
                        this.addChild(shape);
                    };
                    /**
                     * Update model with the state of the view component
                     */
                    Rectangle.prototype.updateModel = function () {
                        var properties = this.model.properties;
                        properties.x = this.bounds.topLeft.x;
                        properties.y = this.bounds.topLeft.y;
                        properties.width = this.bounds.width;
                        properties.height = this.bounds.height;
                    };
                    /**
                     * Calculate the snap points for the component
                     */
                    Rectangle.prototype.getSnapPoints = function () {
                        var properties = this.model.properties;
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
                    Rectangle.prototype.getTransformHandles = function (color) {
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
                    Rectangle.title = 'Rectangle';
                    Rectangle.preview = '/assets/images/components/rectangle.svg';
                    Rectangle.category = 'Basic';
                    return Rectangle;
                })(Drawing.Component.Base);
                Library.Rectangle = Rectangle;
            })(Library = Component.Library || (Component.Library = {}));
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=rectangle.js.map