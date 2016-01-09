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
                var Image = (function (_super) {
                    __extends(Image, _super);
                    /**
                     * Create a new Button component
                     */
                    function Image(model) {
                        _super.call(this, model);
                        // Implement IDefinition members
                        this.id = Drawing.Component.Type.Image;
                        this.tags = [
                            'basic',
                            'image',
                            'picture'
                        ];
                        this.properties = [
                            {
                                label: 'Image',
                                controls: [
                                    {
                                        model: 'media',
                                        type: String,
                                        ui: 'file',
                                        description: 'The image to be displayed.'
                                    }
                                ],
                            }
                        ];
                        var properties = this.getProperties();
                        properties.width = properties.width || 200;
                        properties.height = properties.height || 150;
                        properties.cornerRadius = properties.cornerRadius || 0;
                        // Perform the initial draw
                        this.update();
                    }
                    /**
                     * Redraw the component
                     */
                    Image.prototype.update = function () {
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
                        // Draw the placeholder or the image
                        if (!properties.media) {
                            var shape = paper.Path.Rectangle(bounds, parseInt('' + properties.cornerRadius));
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
                            var raster = new paper.Raster(properties.media._id);
                            raster.position = new paper.Point(bounds.center.x, bounds.center.y);
                            raster.scale(bounds.width / raster.width, bounds.height / raster.height);
                            this.addChild(raster);
                            var outline = paper.Path.Rectangle(bounds);
                            outline.strokeColor = foreColor;
                            outline.strokeWidth = (!this.active && !this.focussed && !this.hovered) ? 0 : 1.5;
                            outline.fillColor = 'rgba(0,0,0,0)';
                            this.addChild(outline);
                        }
                    };
                    /**
                     * Update model with the state of the view component
                     */
                    Image.prototype.updateModel = function () {
                        var properties = this.getProperties();
                        properties.x = this.bounds.topLeft.x;
                        properties.y = this.bounds.topLeft.y;
                        properties.width = this.bounds.width;
                        properties.height = this.bounds.height;
                    };
                    /**
                     * Calculate the snap points for the component
                     */
                    Image.prototype.getSnapPoints = function () {
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
                    Image.prototype.getTransformHandles = function (color) {
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
                    Image.prototype.getProperties = function () {
                        return this.model.properties;
                    };
                    Image.title = 'Image';
                    Image.preview = '/assets/images/components/rectangle.svg';
                    Image.category = 'Basic';
                    return Image;
                })(Drawing.Component.Base);
                Library.Image = Image;
            })(Library = Component.Library || (Component.Library = {}));
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=image.js.map