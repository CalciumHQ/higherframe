/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class IPhone extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.IPhone;
    title = 'iPhone';
    tags = [
      'container',
      'apple',
      'phone'
    ];
    model: Data.Component;
    resizable = false;
    thumbnail = '/assets/images/components/iphone-thumbnail@2x.png';
    snapPoints = [
      { x: -116, y: -232 },		// Bounding box
      { x: 116, y: -232 },
      { x: 116, y: 232 },
      { x: -116, y: 232 },
      { x: -110, y: -184 },		// Screen corners
      { x: 110, y: -184 },
      { x: 110, y: 162 },
      { x: -110, y: 162 },
    ];

    parts: any = {};


    /**
     * Create a new iPhone component
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

      // Remove the old parts
      this.removeChildren();

      var topLeft = new paper.Point(this.model.properties.x - WIDTH/2, this.model.properties.y - HEIGHT/2);
      var bottomRight = new paper.Point(this.model.properties.x + WIDTH/2, this.model.properties.y + HEIGHT/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the outer frame
      var outer = paper.Path.Rectangle(bounds, 20);
      outer.strokeColor = '#888';
      outer.fillColor = 'white';

      // Draw the screen
      var screenRectangle = new paper.Rectangle(
        new paper.Point(bounds.left + 6, bounds.top + 48),
        new paper.Point(bounds.right - 6, bounds.bottom - 70)
      );
      var screen = paper.Path.Rectangle(screenRectangle, 2);
      screen.strokeColor = '#888';

      // Draw the button
      var buttonposition = new paper.Point(this.model.properties.x, bounds.bottom - 35);
      var button = paper.Path.Circle(buttonposition, 24);
      button.strokeColor = '#888';

      // Draw the speaker
      var speakerRectangle = new paper.Rectangle(
        new paper.Point(this.model.properties.x - 23, bounds.top + 27),
        new paper.Point(this.model.properties.x + 23, bounds.top + 33)
      );
      var speaker = paper.Path.Rectangle(speakerRectangle, 3);
      speaker.strokeColor = '#888';

      // Draw the camera
      var cameraposition = new paper.Point(this.model.properties.x, bounds.top + 18);
      var camera = paper.Path.Circle(cameraposition, 4);
      camera.strokeColor = '#888';

      // Group the parts as a component
      this.addChild(outer);
      this.addChild(screen);
      this.addChild(button);
      this.addChild(camera);
      this.addChild(speaker);

      // Define the component parts
      this.parts = {};
      this.parts.outer = outer;
      this.parts.screen = screen;
      this.parts.button = button;
      this.parts.camera = camera;
      this.parts.speaker = speaker;
    }
  }
}
