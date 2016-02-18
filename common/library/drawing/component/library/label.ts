


module Common.Drawing.Component.Library {

  export class Label extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.Label;
    static title = 'Label';
    static preview = '/assets/images/components/iphone.svg';
    static category = 'Basic';
    tags = [
      'basic',
      'text',
      'label',
      'string'
    ];
    propertiesController: string = 'LabelPropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/label.props.html';
    properties = [
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

    model: Common.Data.Component;
    textItem: paper.PointText;


    /**
     * Create a new Label component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

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

    update() {

      var properties = this.getProperties();

      // Determine palette
      var theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
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
    }

    /**
     * Update model with the state of the view component
     */

    updateModel() {

      this.model.properties.x = this.textItem.point.x;
      this.model.properties.y = this.textItem.point.y;
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<SnapPoint> {

      return [
        new SnapPoint(this.bounds.topLeft, 'corner', 'corner'),
        new SnapPoint(this.bounds.topRight, 'corner', 'corner'),
        new SnapPoint(this.bounds.bottomLeft, 'corner', 'corner'),
        new SnapPoint(this.bounds.bottomRight, 'corner', 'corner')
      ];
    }


    /**
     * Cast the model properties into the correct type
     */

    getProperties(): Common.Data.ILabelProperties {

      return <Common.Data.ILabelProperties>this.model.properties;
    }
  }
}
