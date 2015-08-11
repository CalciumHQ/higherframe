/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class Rectangle extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.Rectangle;
    static title = 'Rectangle';
    tags = [
      'basic',
      'shape',
      'flowchart'
    ];
    resizable = true;
    thumbnail = '/assets/images/components/iphone-thumbnail@2x.png';
    snapPoints = [
      { x: -116, y: -232 },		// Bounding box
      { x: 116, y: -232 },
      { x: 116, y: 232 },
      { x: -116, y: 232 }
    ];

    model: Data.Component;
    parts: any = {};


    /**
     * Create a new Rectangle component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);
    }


    /**
     * Redraw the component
     */

    update() {

      var WIDTH = 232;
      var HEIGHT = 464;

      var properties = <Higherframe.Data.IRectangleProperties>this.model.properties;
      properties.width = 200;
      properties.height = 300;
      properties.cornerRadius = 10;

      // Remove the old parts
      this.removeChildren();

      var topLeft = new paper.Point(properties.x, properties.y);
      var bottomRight = new paper.Point(properties.x + properties.width, properties.y + properties.height);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the shape
      var shape = paper.Path.Rectangle(bounds, properties.cornerRadius);
      shape.strokeColor = '#888';
      shape.fillColor = 'white';

      // Group the parts as a component
      this.addChild(shape);

      // Define the component parts
      this.parts = {};
      this.parts.shape = shape;
    }
  }
}
