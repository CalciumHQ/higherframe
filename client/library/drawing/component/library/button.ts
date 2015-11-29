/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class Button extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.Button;
    static title = 'Button';
    static preview = '/assets/images/components/rectangle.svg';
    static category = 'Form';
    tags = [
      'form'
    ];
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
    resizable = true;
    showBounds = false;

    model: Data.Component;


    /**
     * Create a new Button component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);

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

    update() {

      var properties = this.getProperties();

      // Determine palette
      var theme: Higherframe.UI.ITheme = new Higherframe.UI.DefaultTheme();
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
        point: new paper.Point(bounds.center.x, bounds.center.y + properties.fontSize/3),
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
    }


    /**
     * Update model with the state of the view component
     */

    updateModel() {

      var properties = this.getProperties();
      properties.x = this.bounds.topLeft.x;
      properties.y = this.bounds.topLeft.y;
      properties.width = this.bounds.width;
      properties.height = this.bounds.height;
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<SnapPoint> {

      var properties = this.getProperties();

      return [
        new SnapPoint(this.bounds.leftCenter),
        new SnapPoint(this.bounds.topCenter),
        new SnapPoint(this.bounds.rightCenter),
        new SnapPoint(this.bounds.bottomCenter)
      ];
    }


    /**
     * Calculate the transform handles for the component
     */

    getTransformHandles(): Array<IDragHandle> {

      var topLeft = new DragHandle(this.bounds.topLeft);
      topLeft.cursor = Cursors.ResizeNWSE;
      topLeft.onMove = (position: paper.Point): paper.Point => {

        this.bounds.topLeft = position;
        return this.bounds.topLeft;
      };

      var topCenter = new DragHandle(this.bounds.topCenter);
      topCenter.cursor = Cursors.ResizeVertical;
      topCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.topCenter.y = position.y;
        return this.bounds.topCenter;
      };

      var topRight = new DragHandle(this.bounds.topRight);
      topRight.cursor = Cursors.ResizeNESW;
      topRight.onMove = (position: paper.Point): paper.Point => {

        this.bounds.topRight = position;
        return this.bounds.topRight;
      };

      var rightCenter = new DragHandle(this.bounds.rightCenter);
      rightCenter.cursor = Cursors.ResizeHorizontal;
      rightCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.rightCenter.x = position.x;
        return this.bounds.rightCenter;
      };

      var bottomRight = new DragHandle(this.bounds.bottomRight);
      bottomRight.cursor = Cursors.ResizeNWSE;
      bottomRight.onMove = (position: paper.Point): paper.Point => {

        this.bounds.bottomRight = position;
        return this.bounds.bottomRight;
      };

      var bottomCenter = new DragHandle(this.bounds.bottomCenter);
      bottomCenter.cursor = Cursors.ResizeVertical;
      bottomCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.bottomCenter.y = position.y;
        return this.bounds.bottomCenter;
      };

      var bottomLeft = new DragHandle(this.bounds.bottomLeft);
      bottomLeft.cursor = Cursors.ResizeNESW;
      bottomLeft.onMove = (position: paper.Point): paper.Point => {

        this.bounds.bottomLeft = position;
        return this.bounds.bottomLeft;
      };

      var leftCenter = new DragHandle(this.bounds.leftCenter);
      leftCenter.cursor = Cursors.ResizeHorizontal;
      leftCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.leftCenter.x = position.x;
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
     * Calculate the drag handles for the component
     */

    getDragHandles(): Array<IDragHandle> {

      var properties = <Higherframe.Data.IRectangleProperties>this.model.properties;
return [];
      /*return [
        {
          position: new paper.Point(this.position.x - properties.width/2 + Number(properties.cornerRadius), this.position.y - properties.height/2),
          move: (position: paper.Point): paper.Point => {

            // The distance from the top-left corner
            var distance = position.x - (this.position.x - properties.width/2);

            // Only allow the drag handle to move horizontally
            position.y = this.position.y - properties.height/2;

            // Only allow positive radius
            distance = Math.max(0, distance);

            // Only allow up to half the width
            distance = Math.min(properties.width/2, distance);

            position.x = distance + (this.position.x - properties.width/2);
            properties.cornerRadius = distance;
            this.update();

            return position;
          }
        }
      ];*/
    }


    /**
     * Cast the model properties into the correct type
     */

    getProperties(): Higherframe.Data.IButtonProperties {

      return <Higherframe.Data.IButtonProperties>this.model.properties;
    }
  }
}
