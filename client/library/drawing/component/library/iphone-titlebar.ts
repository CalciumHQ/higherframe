/// <reference path="../component.ts"/>
/// <reference path="../type.ts"/>

module Higherframe.Drawing.Component.Library {

  export class IPhoneTitlebar extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IComponent members
    id = Drawing.Component.Type.IPhoneTitlebar;
    static title = 'iPhone titlebar';
    static preview = '/assets/images/components/iphone-titlebar.svg';
    static category = 'Mobile';
    tags = [
      'apple',
      'phone'
    ];
    properties = [
      {
        label: 'Time',
        controls: [
          {
            model: 'time',
            type: String,
            placeholder: 'Display time',
            description: 'Set the time displayed on the titlebar.'
          }
        ]
      }
    ];
    resizable = false;
    showBounds = false;
    preview = '/assets/images/components/iphone.svg';

    model: Data.Component;

    constructor(model: Data.IDrawingModel) {

      super(model);

      // Perform the initial draw
      this.update();
    }

    update() {

      var WIDTH = 220;
      var HEIGHT = 14;

      var properties = <Data.IIPhoneTitlebarProperties>this.model.properties;

      // Determine palette
      var theme: Higherframe.UI.ITheme = new Higherframe.UI.DefaultTheme();
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

      var topLeft = new paper.Point(properties.x - WIDTH/2, properties.y - HEIGHT/2);
      var bottomRight = new paper.Point(properties.x + WIDTH/2, properties.y + HEIGHT/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Remove the old parts
      this.removeChildren();

      // Draw the bar
      var bar = paper.Path.Rectangle(bounds);
      bar.strokeWidth = 0;
      bar.fillColor = 'rgba(255,255,255,0)';

      // Draw the mobile area
      var c1 = paper.Path.Circle(new paper.Point(topLeft.x + 6, topLeft.y + HEIGHT/2), 2);
      c1.strokeWidth = 0;
      c1.fillColor = foreColor;

      var c2 = paper.Path.Circle(new paper.Point(topLeft.x + 11, topLeft.y + HEIGHT/2), 2);
      c2.strokeWidth = 0;
      c2.fillColor = foreColor;

      var c3 = paper.Path.Circle(new paper.Point(topLeft.x + 16, topLeft.y + HEIGHT/2), 2);
      c3.strokeWidth = 0;
      c3.fillColor = foreColor;

      var c4 = paper.Path.Circle(new paper.Point(topLeft.x + 21, topLeft.y + HEIGHT/2), 2);
      c4.strokeWidth = 0;
      c4.fillColor = foreColor;

      var c5 = paper.Path.Circle(new paper.Point(topLeft.x + 26, topLeft.y + HEIGHT/2), 2);
      c5.strokeWidth = 0;
      c5.fillColor = foreColor;

      var carrier = new paper.PointText({
        point: new paper.Point(topLeft.x + 32, topLeft.y + HEIGHT/2 + 3),
        content: 'Carrier',
        fillColor: foreColor,
        fontSize: 9
      });

      var mobile = new paper.Group([
        c1,
        c2,
        c3,
        c4,
        c5,
        carrier
      ]);

      // Draw the indicators
      var batteryOuterRect = new paper.Rectangle(
        new paper.Point(bottomRight.x - 20, bottomRight.y - 4),
        new paper.Point(bottomRight.x - 5, bottomRight.y - HEIGHT + 4)
      );

      var batteryOuter = paper.Path.Rectangle(batteryOuterRect);
      batteryOuter.strokeWidth = 1;
      batteryOuter.strokeColor = foreColor;

      var batteryInnerRect = new paper.Rectangle(
        new paper.Point(bottomRight.x - 19, bottomRight.y - 5),
        new paper.Point(bottomRight.x - 6, bottomRight.y - HEIGHT + 5)
      );

      var batteryInner = paper.Path.Rectangle(batteryInnerRect);
      batteryInner.strokeWidth = 0;
      batteryInner.fillColor = foreColor;

      var batteryKnobRect = new paper.Rectangle(
      new paper.Point(bottomRight.x - 5, bottomRight.y - 8),
      new paper.Point(bottomRight.x - 3, bottomRight.y - HEIGHT + 8)
      );

      var batteryKnob = paper.Path.Rectangle(batteryKnobRect);
      batteryKnob.strokeWidth = 0;
      batteryKnob.fillColor = foreColor;

      var indicators = new paper.Group([
        batteryOuter,
        batteryInner,
        batteryKnob
      ]);

      var time = new paper.PointText({
        point: new paper.Point(topLeft.x + WIDTH/2 - 16, topLeft.y + HEIGHT/2 + 3),
        content: properties.time,
        fillColor: foreColor,
        fontSize: 9,
        fontWeight: 'bold'
      });

      // Group the parts as a component
      this.addChild(bar);
      this.addChild(mobile);
      this.addChild(indicators);
      this.addChild(time);
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

    getSnapPoints(): Array<IPoint> {

      var snapPoints = [];

      snapPoints.push(this.position.add(new paper.Point({ x: -110, y: -7 })));
      snapPoints.push(this.position.add(new paper.Point({ x: 110, y: -7 })));
      snapPoints.push(this.position.add(new paper.Point({ x: 110, y: 7 })));
      snapPoints.push(this.position.add(new paper.Point({ x: -110, y: 7 })));
      return snapPoints;
    }


    /**
     * Calculate the drag points for the component
     */

    getDragPoints(): Array<IPoint> {

      return [];
    }
  }
}
