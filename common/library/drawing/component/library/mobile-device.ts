
module Common.Drawing.Component.Library {

  export class MobileDevice extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.MobileDevice;
    static title = 'Mobile Device';
    static preview = '/assets/images/components/iphone.svg';
    static category = 'Containers';
    tags = [
      'container',
      'apple',
      'phone'
    ];
    propertiesController: string = 'MobileDevicePropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/mobile-device.props.html';

    model: Common.Data.Component;


    // Drawing constants
    static BAR_HEIGHT = 14;

    /**
     * Create a new mobile device component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.width = properties.width || 232;
      properties.height = properties.height || 464;
      properties.showBar = (typeof properties.showBar === 'undefined') ? true : properties.showBar;

      // Perform the initial draw
      this.update();
    }


    /**
     * Utility functions for finding points in the components
     */

    getComponentBounds(): paper.Rectangle {

      var properties = this.getProperties();
      var topLeft = new paper.Point(properties.x - properties.width/2, properties.y - properties.height/2);
      var bottomRight = new paper.Point(properties.x + properties.width/2, properties.y + properties.height/2);

      return new paper.Rectangle(topLeft, bottomRight);
    }

    getScreenRect(): paper.Rectangle {

      let bounds = this.getComponentBounds();

      return new paper.Rectangle(
        new paper.Point(bounds.left + 6, bounds.top + 48),
        new paper.Point(bounds.right - 6, bounds.bottom - 70)
      );
    }

    getUsableScreenRect(): paper.Rectangle {

      var properties = this.getProperties();
      var rect = this.getScreenRect();

      if (properties.showBar) {

        rect.top += MobileDevice.BAR_HEIGHT;
      }

      return rect;
    }


    /**
     * Redraw the component
     */

    update() {

      var properties = this.getProperties();

      // Determine palette
      var theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
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

      var topLeft = new paper.Point(this.model.properties.x - properties.width/2, this.model.properties.y - properties.height/2);
      var bottomRight = new paper.Point(this.model.properties.x + properties.width/2, this.model.properties.y + properties.height/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the outer frame
      var outer = paper.Path.Rectangle(bounds, 20);
      outer.strokeColor = foreColor;
      outer.strokeWidth = 1.5;
      outer.fillColor = 'rgba(255,255,255,0)';

      // Draw the screen
      var screenRectangle = this.getScreenRect();
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

      if (properties.showBar) {

        // The bounds of the status bar
        let statusBounds = new paper.Rectangle(
          screenRectangle.topLeft,
          screenRectangle.topRight.add(new paper.Point(0, MobileDevice.BAR_HEIGHT))
        );

        // Draw the mobile area
        var c1 = paper.Path.Circle(new paper.Point(statusBounds.topLeft.x + 6, statusBounds.topLeft.y + MobileDevice.BAR_HEIGHT/2), 2);
        c1.strokeWidth = 0;
        c1.fillColor = foreColor;

        var c2 = paper.Path.Circle(new paper.Point(statusBounds.topLeft.x + 11, statusBounds.topLeft.y + MobileDevice.BAR_HEIGHT/2), 2);
        c2.strokeWidth = 0;
        c2.fillColor = foreColor;

        var c3 = paper.Path.Circle(new paper.Point(statusBounds.topLeft.x + 16, statusBounds.topLeft.y + MobileDevice.BAR_HEIGHT/2), 2);
        c3.strokeWidth = 0;
        c3.fillColor = foreColor;

        var c4 = paper.Path.Circle(new paper.Point(statusBounds.topLeft.x + 21, statusBounds.topLeft.y + MobileDevice.BAR_HEIGHT/2), 2);
        c4.strokeWidth = 0;
        c4.fillColor = foreColor;

        var c5 = paper.Path.Circle(new paper.Point(statusBounds.topLeft.x + 26, statusBounds.topLeft.y + MobileDevice.BAR_HEIGHT/2), 2);
        c5.strokeWidth = 0;
        c5.fillColor = foreColor;

        var carrier = new paper.PointText({
          point: new paper.Point(statusBounds.topLeft.x + 32, statusBounds.topLeft.y + MobileDevice.BAR_HEIGHT/2 + 3),
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
        this.addChild(mobile);

        // Draw the indicators
        var batteryOuterRect = new paper.Rectangle(
          new paper.Point(statusBounds.bottomRight.x - 20, statusBounds.bottomRight.y - 4),
          new paper.Point(statusBounds.bottomRight.x - 5, statusBounds.bottomRight.y - MobileDevice.BAR_HEIGHT + 4)
        );

        var batteryOuter = paper.Path.Rectangle(batteryOuterRect);
        batteryOuter.strokeWidth = 1;
        batteryOuter.strokeColor = foreColor;

        var batteryInnerRect = new paper.Rectangle(
          new paper.Point(statusBounds.bottomRight.x - 19, statusBounds.bottomRight.y - 5),
          new paper.Point(statusBounds.bottomRight.x - 6, statusBounds.bottomRight.y - MobileDevice.BAR_HEIGHT + 5)
        );

        var batteryInner = paper.Path.Rectangle(batteryInnerRect);
        batteryInner.strokeWidth = 0;
        batteryInner.fillColor = foreColor;

        var batteryKnobRect = new paper.Rectangle(
        new paper.Point(statusBounds.bottomRight.x - 5, statusBounds.bottomRight.y - 8),
        new paper.Point(statusBounds.bottomRight.x - 3, statusBounds.bottomRight.y - MobileDevice.BAR_HEIGHT + 8)
        );

        var batteryKnob = paper.Path.Rectangle(batteryKnobRect);
        batteryKnob.strokeWidth = 0;
        batteryKnob.fillColor = foreColor;

        var indicators = new paper.Group([
          batteryOuter,
          batteryInner,
          batteryKnob
        ]);
        this.addChild(indicators);

        // Draw the time
        var time = new paper.PointText({
          point: new paper.Point(statusBounds.center.x, statusBounds.center.y + 3),
          content: '3:29 pm',
          fillColor: foreColor,
          fontSize: 9,
          fontWeight: 'bold',
          justification: 'center'
        });
        this.addChild(time);
      }
    }

    /**
     * Update model with the state of the view component
     */

    updateModel() {

      var properties = this.getProperties();
      properties.x = this.position.x;
      properties.y = this.position.y;
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<SnapPoint> {

      let bounds = this.getComponentBounds();
      var screenRect = this.getUsableScreenRect();

      return [
        // Screen corners
        new SnapPoint(bounds.topLeft, 'corner', 'corner', 1.5),
        new SnapPoint(bounds.topRight, 'corner', 'corner', 1.5),
        new SnapPoint(bounds.bottomRight, 'corner', 'corner', 1.5),
        new SnapPoint(bounds.bottomLeft, 'corner', 'corner', 1.5),

        // Inner screen corners
        new SnapPoint(screenRect.topLeft, 'inner corner', 'inner corner', 0.9),
        new SnapPoint(screenRect.topRight, 'inner corner', 'inner corner', 0.9),
        new SnapPoint(screenRect.bottomRight, 'inner corner', 'inner corner', 0.9),
        new SnapPoint(screenRect.bottomLeft, 'inner corner', 'inner corner', 0.9),

        // Inner screen margins
        new SnapPoint(screenRect.topLeft.add(new paper.Point({ x: 15, y: 15 })), 'margin', 'margin', 0.6),
        new SnapPoint(screenRect.topRight.add(new paper.Point({ x: -15, y: 15 })), 'margin', 'margin', 0.6),
        new SnapPoint(screenRect.bottomRight.add(new paper.Point({ x: -15, y: -15 })), 'margin', 'margin', 0.6),
        new SnapPoint(screenRect.bottomLeft.add(new paper.Point({ x: 15, y: -15 })), 'margin', 'margin', 0.6)
      ];
    }


    /**
     * Calculate the transform handles for the component
     */

    getTransformHandles(color: paper.Color): Array<IDragHandle> {

      var topLeft = new DragHandle(this.bounds.topLeft, color);
      topLeft.cursor = Cursors.ResizeNWSE;
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
      topCenter.cursor = Cursors.ResizeVertical;
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
      topRight.cursor = Cursors.ResizeNESW;
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
      rightCenter.cursor = Cursors.ResizeHorizontal;
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
      bottomRight.cursor = Cursors.ResizeNWSE;
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
      bottomCenter.cursor = Cursors.ResizeVertical;
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
      bottomLeft.cursor = Cursors.ResizeNESW;
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
      leftCenter.cursor = Cursors.ResizeHorizontal;
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

    getProperties(): Common.Data.IMobileDeviceProperties {

      return <Common.Data.IMobileDeviceProperties>this.model.properties;
    }
  }
}
