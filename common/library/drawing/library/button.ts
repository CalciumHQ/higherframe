


module Common.Drawing.Library {

  export class Button extends Drawing.Component {

    // Implement IDefinition members
    id = Drawing.ComponentType.Button;
    static title = 'Button';
    static category = 'Form';
    tags = [
      'form'
    ];
    propertiesController: string = 'ButtonPropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/button.props.html';
    properties = [
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

    model: Common.Data.Component;


    /**
     * Create a new Button component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      var theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
      properties.width = properties.width || 160;
      properties.height = properties.height || 32;
      properties.label = (typeof properties.label === 'undefined') ? 'Submit' : properties.label;
      properties.fontFamily = properties.fontFamily || 'Helvetica Neue';
      properties.fontSize = properties.fontSize || 14;
      properties.fontWeight = properties.fontWeight || 400;
      properties.cornerRadius = properties.cornerRadius || 5;
      properties.opacity = (properties.opacity == null) ? 100 : properties.opacity;
      properties.fillColor = (properties.borderColor == null) ? theme.ShadingDefault.toCSS(true) : properties.fillColor;
      properties.borderColor = (properties.borderColor == null) ? theme.ComponentDefault.toCSS(true) : properties.borderColor;
      properties.borderWidth = (properties.borderWidth == null) ? 1 : properties.borderWidth;

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
      var backColor = theme.ShadingDefault;

      if (this.active) {

        foreColor = theme.ComponentActive;
      }

      else if (this.hovered) {

        foreColor = theme.ComponentHover;
      }

      // Apply opacity
      if (this.focussed || (!this.active && !this.hovered)) {

        foreColor.alpha = properties.opacity / 100;
      }

      // Remove the old parts
      this.removeChildren();

      var topLeft = new paper.Point(properties.x - properties.width/2, properties.y - properties.height/2);
      var bottomRight = new paper.Point(properties.x + properties.width/2, properties.y + properties.height/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the shape
      var shape = paper.Path.Rectangle(bounds, parseInt('' + properties.cornerRadius));
      shape.strokeColor = foreColor;
      shape.strokeWidth = properties.borderWidth;

      if (properties.fillColor) {

        var fillColor = new paper.Color(properties.fillColor);
        fillColor.alpha = properties.opacity / 100;
        shape.fillColor = fillColor;
      }

      else {

        shape.fillColor = 'rgba(0,0,0,0)';
      }

      // Draw the label
      var label = new paper.PointText({
        point: new paper.Point(bounds.center.x, bounds.center.y + properties.fontSize/3),
        content: properties.label,
        fillColor: foreColor,
        fontSize: properties.fontSize,
        fontWeight: properties.fontWeight,
        fontFamily: properties.fontFamily,
        justification: 'center'
      });

      // Group the parts as a component
      this.addChild(shape);
      this.addChild(label);
    }


    /**
     * Update model with the state of the view component
     */

    updateModel() {

      var properties = this.getProperties();
      properties.x = this.bounds.center.x;
      properties.y = this.bounds.center.y;
      properties.width = this.bounds.width;
      properties.height = this.bounds.height;
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<SnapPoint> {

      var properties = this.getProperties();

      return [
        new SnapPoint(this.bounds.leftCenter, 'edge', 'center'),
        new SnapPoint(this.bounds.topCenter, 'center', 'edge'),
        new SnapPoint(this.bounds.rightCenter, 'edge', 'center'),
        new SnapPoint(this.bounds.bottomCenter, 'center', 'edge')
      ];
    }


    /**
     * Calculate the transform handles for the component
     */

    getTransformHandles(color: paper.Color): Array<DragHandle> {

      var topLeft = new DragHandle(this.bounds.topLeft);
      topLeft.cursor = 'nwse-resize';
      topLeft.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'corner', 'corner')];
      };
      topLeft.onMove = (position: paper.Point): paper.Point => {

        this.bounds.topLeft = position;

        this.updateModel();
        this.update();

        return this.bounds.topLeft;
      };

      var topCenter = new DragHandle(this.bounds.topCenter);
      topCenter.cursor = 'ns-resize';
      topCenter.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'center', 'edge')];
      };
      topCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.topCenter.y = position.y;

        this.updateModel();
        this.update();

        return this.bounds.topCenter;
      };

      var topRight = new DragHandle(this.bounds.topRight);
      topRight.cursor = 'nesw-resize';
      topRight.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'corner', 'corner')];
      };
      topRight.onMove = (position: paper.Point): paper.Point => {

        this.bounds.topRight = position;

        this.updateModel();
        this.update();

        return this.bounds.topRight;
      };

      var rightCenter = new DragHandle(this.bounds.rightCenter);
      rightCenter.cursor = 'ew-resize';
      rightCenter.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'edge', 'center')];
      };
      rightCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.rightCenter.x = position.x;

        this.updateModel();
        this.update();

        return this.bounds.rightCenter;
      };

      var bottomRight = new DragHandle(this.bounds.bottomRight);
      bottomRight.cursor = 'nwse-resize';
      bottomRight.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'corner', 'corner')];
      };
      bottomRight.onMove = (position: paper.Point): paper.Point => {

        this.bounds.bottomRight = position;

        this.updateModel();
        this.update();

        return this.bounds.bottomRight;
      };

      var bottomCenter = new DragHandle(this.bounds.bottomCenter);
      bottomCenter.cursor = 'ns-resize';
      bottomCenter.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'center', 'edge')];
      };
      bottomCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.bottomCenter.y = position.y;

        this.updateModel();
        this.update();

        return this.bounds.bottomCenter;
      };

      var bottomLeft = new DragHandle(this.bounds.bottomLeft);
      bottomLeft.cursor = 'nesw-resize';
      bottomLeft.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'corner', 'corner')];
      };
      bottomLeft.onMove = (position: paper.Point): paper.Point => {

        this.bounds.bottomLeft = position;

        this.updateModel();
        this.update();

        return this.bounds.bottomLeft;
      };

      var leftCenter = new DragHandle(this.bounds.leftCenter);
      leftCenter.cursor = 'ew-resize';
      leftCenter.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'edge', 'center')];
      };
      leftCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.leftCenter.x = position.x;

        this.updateModel();
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

    getProperties(): Common.Data.IButtonProperties {

      return <Common.Data.IButtonProperties>this.model.properties;
    }
  }
}
