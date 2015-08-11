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

    model: Data.Component;


    /**
     * Create a new Rectangle component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);

      var properties = <Higherframe.Data.IRectangleProperties>this.model.properties;
      properties.width = 200;
      properties.height = 300;
      properties.cornerRadius = 10;
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
      shape.fillColor = 'white';

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
  }
}
