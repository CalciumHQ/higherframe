/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class Rectangle extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.Rectangle;
    static title = 'Rectangle';
    static preview = '/assets/images/components/rectangle.svg';
    static category = 'Basic';
    tags = [
      'basic',
      'shape',
      'flowchart'
    ];
    properties = [
      {
        label: 'Width',
        model: 'width',
        type: Number,
        description: 'The width of the rectangle.'
      },
      {
        label: 'Height',
        model: 'height',
        type: Number,
        description: 'The height of the rectangle.'
      },
      {
        label: 'Radius',
        model: 'cornerRadius',
        type: Number,
        description: 'The corner radius describes how rounded the corners should be.'
      }
    ];
    resizable = true;
    showBounds = false;

    model: Data.Component;


    /**
     * Create a new Rectangle component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);

      var properties = <Higherframe.Data.IRectangleProperties>this.model.properties;
      properties.width = properties.width || 160;
      properties.height = properties.height || 120;
      properties.cornerRadius = properties.cornerRadius || 0;

      // Perform the initial draw
      this.update();
    }


    /**
     * Redraw the component
     */

    update() {

      var properties = <Higherframe.Data.IRectangleProperties>this.model.properties;

      // Remove the old parts
      this.removeChildren();

      var topLeft = new paper.Point(properties.x, properties.y);
      var bottomRight = new paper.Point(properties.x + properties.width, properties.y + properties.height);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the shape
      var shape = paper.Path.Rectangle(bounds, properties.cornerRadius);
      shape.strokeColor = '#888';
      shape.fillColor = 'rgba(0,0,0,0)';

      // Group the parts as a component
      this.addChild(shape);
    }


    /**
     * Update model with the state of the view component
     */

    updateModel() {

      var properties = <Higherframe.Data.IRectangleProperties>this.model.properties;
      this.model.properties.x = this.position.x - properties.width/2;
      this.model.properties.y = this.position.y - properties.height/2;
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<IPoint> {

      var properties = <Higherframe.Data.IRectangleProperties>this.model.properties;

      return [
        new paper.Point(this.position.x - properties.width/2, this.position.y - properties.height/2),
        new paper.Point(this.position.x + properties.width/2, this.position.y - properties.height/2),
        new paper.Point(this.position.x + properties.width/2, this.position.y + properties.height/2),
        new paper.Point(this.position.x - properties.width/2, this.position.y + properties.height/2)
      ];
    }


    /**
     * Calculate the drag handles for the component
     */

    getDragHandles(): Array<IDragHandle> {

      var properties = <Higherframe.Data.IRectangleProperties>this.model.properties;

      return [
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
      ];
    }
  }
}
