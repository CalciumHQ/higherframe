


module Common.Drawing.Library {

  export class Label extends Drawing.Component {

    // Implement IDefinition members
    id = Drawing.ComponentType.Label;
    static title = 'Label';
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
      properties.lineHeight = properties.lineHeight || 20;
      properties.justification = properties.justification || 'left';
      properties.area = (properties.area == null) ? true : properties.area;

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

      var topLeft = new paper.Point(properties.x - (properties.width/2), properties.y - (properties.height/2));
      var bottomRight = new paper.Point(properties.x + (properties.width/2), properties.y + (properties.height/2));
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Area text
      if (properties.area) {

        var rect = paper.Path.Rectangle(bounds);
        rect.fillColor = 'rgba(255,255,255,0.0000000001)';
        this.addChild(rect);

        // Draw the text
        var text = new paper.AreaText({
          rectangle: bounds,
          content: properties.text,
          fillColor: foreColor,
          fontSize: properties.fontSize,
          fontWeight: properties.fontWeight,
          fontFamily: 'Myriad Pro',
          leading: properties.lineHeight
        });
        this.addChild(text);
      }

      // Point text
      else {

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
    }

    /**
     * Update model with the state of the view component
     */

    updateModel() {

      var properties = this.getProperties();
      if (!properties.area) {

        this.model.properties.x = this.textItem.point.x;
        this.model.properties.y = this.textItem.point.y;
      }
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
     * Calculate the transform handles for the component
     */

    getTransformHandles(color: paper.Color): Array<IDragHandle> {

      // No handles if a point text
      var properties = this.getProperties();
      if (!properties.area) {

        return [];
      }

      // Return handles if an area text
      var topLeft = new DragHandle(this.bounds.topLeft, color);
      topLeft.cursor = 'nwse-resize';
      topLeft.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'corner', 'corner')];
      };
      topLeft.onMove = (position: paper.Point): paper.Point => {

        var properties = this.getProperties();

        this.bounds.topLeft = position;
        properties.x = this.bounds.center.x;
        properties.y = this.bounds.center.y;
        properties.width = this.bounds.width;
        properties.height = this.bounds.height;
        this.update();

        return this.bounds.topLeft;
      };

      var topCenter = new DragHandle(this.bounds.topCenter, color);
      topCenter.cursor = 'ns-resize';
      topCenter.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'center', 'edge')];
      };
      topCenter.onMove = (position: paper.Point): paper.Point => {

        var properties = this.getProperties();

        this.bounds.topCenter = position;
        properties.y = this.bounds.center.y;
        properties.height = this.bounds.height;
        this.update();

        return this.bounds.topCenter;
      };

      var topRight = new DragHandle(this.bounds.topRight, color);
      topRight.cursor = 'nesw-resize';
      topRight.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'corner', 'corner')];
      };
      topRight.onMove = (position: paper.Point): paper.Point => {

        var properties = this.getProperties();

        this.bounds.topRight = position;
        properties.x = this.bounds.center.x;
        properties.y = this.bounds.center.y;
        properties.width = this.bounds.width;
        properties.height = this.bounds.height;
        this.update();

        return this.bounds.topRight;
      };

      var rightCenter = new DragHandle(this.bounds.rightCenter, color);
      rightCenter.cursor = 'ew-resize';
      rightCenter.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'edge', 'center')];
      };
      rightCenter.onMove = (position: paper.Point): paper.Point => {

        var properties = this.getProperties();

        this.bounds.rightCenter = position;
        properties.x = this.bounds.center.x;
        properties.width = this.bounds.width;
        this.update();

        return this.bounds.rightCenter;
      };

      var bottomRight = new DragHandle(this.bounds.bottomRight, color);
      bottomRight.cursor = 'nwse-resize';
      bottomRight.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'corner', 'corner')];
      };
      bottomRight.onMove = (position: paper.Point): paper.Point => {

        var properties = this.getProperties();

        this.bounds.bottomRight = position;
        properties.x = this.bounds.center.x;
        properties.y = this.bounds.center.y;
        properties.width = this.bounds.width;
        properties.height = this.bounds.height;
        this.update();

        return this.bounds.bottomRight;
      };

      var bottomCenter = new DragHandle(this.bounds.bottomCenter, color);
      bottomCenter.cursor = 'ns-resize';
      bottomCenter.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'center', 'edge')];
      };
      bottomCenter.onMove = (position: paper.Point): paper.Point => {

        var properties = this.getProperties();

        this.bounds.bottomCenter = position;
        properties.y = this.bounds.center.y;
        properties.height = this.bounds.height;
        this.update();

        return this.bounds.bottomCenter;
      };

      var bottomLeft = new DragHandle(this.bounds.bottomLeft, color);
      bottomLeft.cursor = 'nesw-resize';
      bottomLeft.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'corner', 'corner')];
      };
      bottomLeft.onMove = (position: paper.Point): paper.Point => {

        var properties = this.getProperties();

        this.bounds.bottomLeft = position;
        properties.x = this.bounds.center.x;
        properties.y = this.bounds.center.y;
        properties.width = this.bounds.width;
        properties.height = this.bounds.height;
        this.update();

        return this.bounds.bottomLeft;
      };

      var leftCenter = new DragHandle(this.bounds.leftCenter, color);
      leftCenter.cursor = 'ew-resize';
      leftCenter.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'edge', 'center')];
      };
      leftCenter.onMove = (position: paper.Point): paper.Point => {

        var properties = this.getProperties();

        this.bounds.leftCenter = position;
        properties.x = this.bounds.center.x;
        properties.width = this.bounds.width;
        this.update();

        return this.bounds.leftCenter;
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


    /**
     * Cast the model properties into the correct type
     */

    getProperties(): Common.Data.ILabelProperties {

      return <Common.Data.ILabelProperties>this.model.properties;
    }
  }
}
