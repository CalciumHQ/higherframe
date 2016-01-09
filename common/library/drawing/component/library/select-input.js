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
                var SelectInput = (function (_super) {
                    __extends(SelectInput, _super);
                    /**
                     * Create a new Select component
                     */
                    function SelectInput(model) {
                        _super.call(this, model);
                        // Implement IDefinition members
                        this.id = Drawing.Component.Type.SelectInput;
                        this.tags = [
                            'form',
                            'input',
                            'select'
                        ];
                        this.properties = [
                            {
                                label: 'Placeholder',
                                controls: [
                                    {
                                        model: 'placeholder',
                                        type: String,
                                        description: 'Set the placeholder of the input.'
                                    }
                                ]
                            },
                            {
                                label: 'Value',
                                controls: [
                                    {
                                        model: 'value',
                                        type: String,
                                        placeholder: 'Control value',
                                        description: 'Set the value of the input.'
                                    }
                                ]
                            },
                            {
                                label: 'Font',
                                controls: [
                                    {
                                        model: 'fontSize',
                                        type: Number,
                                        unit: 'px',
                                        description: 'Set the font size of the input.'
                                    },
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
                            }
                        ];
                        var properties = this.model.properties;
                        properties.width = properties.width || 160;
                        properties.placeholder = properties.placeholder || 'Select option';
                        properties.fontSize = properties.fontSize || 14;
                        properties.fontWeight = properties.fontWeight || 400;
                        // Perform the initial draw
                        this.update();
                    }
                    /**
                     * Redraw the component
                     */
                    SelectInput.prototype.update = function () {
                        var properties = this.model.properties;
                        var HEIGHT = this.getHeight();
                        // Determine palette
                        var theme = new Common.UI.DefaultTheme();
                        var foreColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefault;
                        var foreColorDark = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefaultDark;
                        var foreColorLight = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefaultLight;
                        if (this.active) {
                            foreColor = theme.ComponentActive;
                        }
                        else if (this.focussed) {
                            foreColor = theme.ComponentFocus;
                            foreColorDark = theme.ComponentFocusDark;
                            foreColorLight = theme.ComponentFocusLight;
                        }
                        else if (this.hovered) {
                            foreColor = theme.ComponentHover;
                            foreColorDark = theme.ComponentHoverDark;
                            foreColorLight = theme.ComponentHoverLight;
                        }
                        // Remove the old parts
                        this.removeChildren();
                        var topLeft = new paper.Point(this.model.properties.x - properties.width / 2, this.model.properties.y - HEIGHT / 2);
                        var bottomRight = new paper.Point(this.model.properties.x + properties.width / 2, this.model.properties.y + HEIGHT / 2);
                        var bounds = new paper.Rectangle(topLeft, bottomRight);
                        // Draw the outer frame
                        var outer = paper.Path.Rectangle(bounds);
                        outer.strokeColor = foreColor;
                        outer.strokeWidth = 1.5;
                        outer.fillColor = 'rgba(255,255,255,1)';
                        // Draw the value
                        var value = new paper.PointText({
                            point: new paper.Point(topLeft.x + 10, topLeft.y + HEIGHT / 2 + properties.fontSize / 3 + 1),
                            content: properties.value ? properties.value : properties.placeholder,
                            fillColor: properties.value ? foreColorDark : foreColorLight,
                            fontSize: properties.fontSize,
                            fontWeight: properties.fontWeight,
                            fontFamily: 'Myriad Pro'
                        });
                        // Draw the caret
                        var caret = new paper.Path();
                        caret.add(new paper.Point(properties.x + (properties.width / 2 - 14) - 4.5, properties.y - 2));
                        caret.add(new paper.Point(properties.x + (properties.width / 2 - 14), properties.y + 3));
                        caret.add(new paper.Point(properties.x + (properties.width / 2 - 14) + 4.5, properties.y - 2));
                        caret.strokeColor = foreColor;
                        caret.strokeWidth = 2;
                        this.addChild(caret);
                        // Group the parts as a component
                        this.addChild(outer);
                        this.addChild(value);
                        this.addChild(caret);
                    };
                    /**
                     * Update model with the state of the view component
                     */
                    SelectInput.prototype.updateModel = function () {
                        var properties = this.getProperties();
                        properties.x = this.bounds.center.x;
                        properties.y = this.bounds.center.y;
                        properties.width = this.bounds.width;
                    };
                    /**
                     * Calculate the transform handles for the component
                     */
                    SelectInput.prototype.getTransformHandles = function (color) {
                        var _this = this;
                        var rightCenter = new Component.DragHandle(this.bounds.rightCenter, color);
                        rightCenter.cursor = Drawing.Cursors.ResizeHorizontal;
                        rightCenter.onMove = function (position) {
                            _this.bounds.rightCenter.x = position.x;
                            _this.updateModel();
                            _this.update();
                            return _this.bounds.rightCenter;
                        };
                        var leftCenter = new Component.DragHandle(this.bounds.leftCenter, color);
                        leftCenter.cursor = Drawing.Cursors.ResizeHorizontal;
                        leftCenter.onMove = function (position) {
                            _this.bounds.leftCenter.x = position.x;
                            _this.updateModel();
                            _this.update();
                            return _this.bounds.leftCenter;
                        };
                        return [
                            rightCenter,
                            leftCenter
                        ];
                    };
                    ;
                    /**
                     * Calculate the snap points for the component
                     */
                    SelectInput.prototype.getSnapPoints = function () {
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
                    SelectInput.prototype.getProperties = function () {
                        return this.model.properties;
                    };
                    /**
                     * Calculate the height of the component
                     */
                    SelectInput.prototype.getHeight = function () {
                        var properties = this.getProperties();
                        return 2 * Number(properties.fontSize);
                    };
                    SelectInput.title = 'Select control';
                    SelectInput.preview = '/assets/images/components/iphone.svg';
                    SelectInput.category = 'Form';
                    return SelectInput;
                })(Drawing.Component.Base);
                Library.SelectInput = SelectInput;
            })(Library = Component.Library || (Component.Library = {}));
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=select-input.js.map