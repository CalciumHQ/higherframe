/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class IPhone extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.IPhone;
    static title = 'iPhone';
    static preview = '/assets/images/components/iphone.svg';
    static category = 'Containers';
    tags = [
      'container',
      'apple',
      'phone'
    ];
    properties = [];

    model: Data.Component;


    /**
     * Create a new iPhone component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);

      // Perform the initial draw
      this.update();
    }


    /**
     * Redraw the component
     */

    update() {

      var WIDTH = 232;
      var HEIGHT = 464;

      // Determine palette
      var theme: Higherframe.UI.ITheme = new Higherframe.UI.DefaultTheme();
      var foreColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefault;

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

      var topLeft = new paper.Point(this.model.properties.x - WIDTH/2, this.model.properties.y - HEIGHT/2);
      var bottomRight = new paper.Point(this.model.properties.x + WIDTH/2, this.model.properties.y + HEIGHT/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the outer frame
      var outer = paper.Path.Rectangle(bounds, 20);
      outer.strokeColor = foreColor;
      outer.strokeWidth = 1.5;
      outer.fillColor = 'rgba(255,255,255,1)';

      // Draw the screen
      var screenRectangle = new paper.Rectangle(
        new paper.Point(bounds.left + 6, bounds.top + 48),
        new paper.Point(bounds.right - 6, bounds.bottom - 70)
      );
      var screen = paper.Path.Rectangle(screenRectangle, 2);
      screen.strokeColor = foreColor;
      screen.strokeWidth = 1.5;

      // Draw the button
      var buttonposition = new paper.Point(this.model.properties.x, bounds.bottom - 35);
      var button = paper.Path.Circle(buttonposition, 24);
      button.strokeColor = foreColor;
      button.strokeWidth = 1.5;

      // Draw the speaker
      var speakerRectangle = new paper.Rectangle(
        new paper.Point(this.model.properties.x - 23, bounds.top + 27),
        new paper.Point(this.model.properties.x + 23, bounds.top + 33)
      );
      var speaker = paper.Path.Rectangle(speakerRectangle, 3);
      speaker.strokeColor = foreColor;
      speaker.strokeWidth = 1.5;

      // Draw the camera
      var cameraposition = new paper.Point(this.model.properties.x, bounds.top + 18);
      var camera = paper.Path.Circle(cameraposition, 4);
      camera.strokeColor = foreColor;
      camera.strokeWidth = 1.5;

      // Group the parts as a component
      this.addChild(outer);
      this.addChild(screen);
      this.addChild(button);
      this.addChild(camera);
      this.addChild(speaker);
    }

    /**
     * Update model with the state of the view component
     */

    updateModel() {

      this.model.properties.x = this.position.x;
      this.model.properties.y = this.position.y;
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<SnapPoint> {

      return [
        // Screen corners
        new SnapPoint(this.position.add(new paper.Point({ x: -116, y: -232 })), 'corner', 'corner', 1.5),
        new SnapPoint(this.position.add(new paper.Point({ x: 116, y: -232 })), 'corner', 'corner', 1.5),
        new SnapPoint(this.position.add(new paper.Point({ x: 116, y: 232 })), 'corner', 'corner', 1.5),
        new SnapPoint(this.position.add(new paper.Point({ x: -116, y: 232 })), 'corner', 'corner', 1.5),

        // Inner screen corners
        new SnapPoint(this.position.add(new paper.Point({ x: -110, y: -184 })), 'inner corner', 'inner corner', 0.8),
        new SnapPoint(this.position.add(new paper.Point({ x: 110, y: -184 })), 'inner corner', 'inner corner', 0.8),
        new SnapPoint(this.position.add(new paper.Point({ x: 110, y: 162 })), 'inner corner', 'inner corner', 0.8),
        new SnapPoint(this.position.add(new paper.Point({ x: -110, y: 162 })), 'inner corner', 'inner corner', 0.8)
      ];
    }
  }
}
