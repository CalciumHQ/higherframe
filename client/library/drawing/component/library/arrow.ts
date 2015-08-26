/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class Arrow extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.Arrow;
    static title = 'Arrow';
    static preview = '/assets/images/components/arrow.svg';
    static category = 'Basic shapes';
    tags = [
      'basic',
      'line',
      'flowchart'
    ];
    properties = [
      {
        label: 'Direction',
        model: 'direction',
        type: String,
        description: 'Set which ends of the line should have an arrow head.'
      }
    ];
    resizable = true;
    showBounds = false;
    thumbnail = '/assets/images/components/iphone-thumbnail@2x.png';
    snapPoints = [
      { x: -116, y: -232 },		// Bounding box
      { x: 116, y: -232 }
    ];

    model: Data.Component;


    /**
     * Create a new Arrow component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);
    }


    /**
     * Redraw the component
     */

    update() {

      var properties = <Higherframe.Data.IArrowProperties>this.model.properties;
      properties.start = new paper.Point(100, 200);
      properties.end = new paper.Point(300, 300);

      // Remove the old parts
      this.removeChildren();

      var start = new paper.Point(properties.start.x, properties.start.y);
      var end = new paper.Point(properties.end.x, properties.end.y);
      var vector = end.subtract(start);

      // Draw the line
      var line = new paper.Path();
      line.add(start);
      line.add(end);
      line.strokeColor = '#888';
      this.addChild(line);

      // Draw the heads
      if (properties.direction == 'left' || properties.direction == 'both') {

        var startHead = paper.Path.RegularPolygon(start, 3, 6);
        startHead.fillColor = '#888';
        startHead.rotate(-90 + vector.angle, start);
        this.addChild(startHead);
      }

      if (properties.direction == 'right' || properties.direction == 'both') {

        var endHead = paper.Path.RegularPolygon(end, 3, 6);
        endHead.fillColor = '#888';
        endHead.rotate(90 + vector.angle, end);
        this.addChild(endHead);
      }
    }

    /**
     * Update model with the state of the view component
     */

    updateModel() {

      this.model.properties.x = this.position.x;
      this.model.properties.y = this.position.y;
    }


    /**
     * Calculate the drag points for the component
     */

    getDragPoints(): Array<IPoint> {

      return [];
    }
  }
}
