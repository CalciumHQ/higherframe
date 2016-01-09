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
                var Label = (function (_super) {
                    __extends(Label, _super);
                    /**
                     * Create a new Label component
                     */
                    function Label(model) {
                        _super.call(this, model);
                        // Implement IDefinition members
                        this.id = Drawing.Component.Type.Label;
                        this.tags = [
                            'basic',
                            'text',
                            'label',
                            'string'
                        ];
                        this.properties = [
                            {
                                label: 'Text',
                                controls: [
                                    {
                                        model: 'text',
                                        type: String,
                                        description: 'Set the text in the label.'
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
                        var properties = this.getProperties();
                        properties.text = properties.text || 'Label';
                        properties.fontSize = properties.fontSize || 14;
                        properties.fontWeight = properties.fontWeight || 400;
                        // Perform the initial draw
                        this.update();
                    }
                    /**
                     * Redraw the component
                     */
                    Label.prototype.update = function () {
                        var properties = this.getProperties();
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
                        // Draw the text
                        this.textItem = new paper.PointText({
                            point: new paper.Point(properties.x, properties.y),
                            content: properties.text,
                            fillColor: foreColor,
                            fontSize: properties.fontSize,
                            fontWeight: properties.fontWeight,
                            fontFamily: 'Myriad Pro'
                        });
                        this.addChild(this.textItem);
                    };
                    /**
                     * Update model with the state of the view component
                     */
                    Label.prototype.updateModel = function () {
                        this.model.properties.x = this.textItem.point.x;
                        this.model.properties.y = this.textItem.point.y;
                    };
                    /**
                     * Calculate the snap points for the component
                     */
                    Label.prototype.getSnapPoints = function () {
                        return [
                            new Drawing.SnapPoint(this.bounds.topLeft, 'corner', 'corner'),
                            new Drawing.SnapPoint(this.bounds.topRight, 'corner', 'corner'),
                            new Drawing.SnapPoint(this.bounds.bottomLeft, 'corner', 'corner'),
                            new Drawing.SnapPoint(this.bounds.bottomRight, 'corner', 'corner')
                        ];
                    };
                    /**
                     * Cast the model properties into the correct type
                     */
                    Label.prototype.getProperties = function () {
                        return this.model.properties;
                    };
                    Label.title = 'Label';
                    Label.preview = '/assets/images/components/iphone.svg';
                    Label.category = 'Basic';
                    return Label;
                })(Drawing.Component.Base);
                Library.Label = Label;
            })(Library = Component.Library || (Component.Library = {}));
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=label.js.map