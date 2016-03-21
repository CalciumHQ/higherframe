
module Common.Drawing.Library {

  export class Browser extends Drawing.Component {

    // Implement IDefinition members
    id = Drawing.ComponentType.MobileDevice;
    static title = 'Browser';
    static category = 'Containers';
    tags = [
      'container',
      'apple',
      'phone'
    ];
    propertiesController: string = 'BrowserPropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/browser.props.html';

    model: Common.Data.Component;


    // Drawing constants
    static TAB_BAR_HEIGHT = 30;
    static TAB_HEIGHT = 24;

    static BAR_CONTROL_SIZE = 26;
    static BAR_CONTROL_MARGIN = 5;
    static BAR_HEIGHT = 36;

    /**
     * Create a new mobile device component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.width = properties.width || 1024;
      properties.height = properties.height || 768;

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
        new paper.Point(bounds.left, bounds.top + Browser.TAB_BAR_HEIGHT + Browser.BAR_HEIGHT),
        new paper.Point(bounds.right, bounds.bottom)
      );
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

      // Draw the tab bar
      var tabBarTopLeft = topLeft;
      var tabBarBottomRight = new paper.Point(bottomRight.x, topLeft.y + Browser.TAB_BAR_HEIGHT);
      var tabBar = paper.Path.Rectangle(new paper.Rectangle(tabBarTopLeft, tabBarBottomRight));
      tabBar.fillColor = '#f4f4f4';
      this.addChild(tabBar);

      var by = (tabBarTopLeft.y + tabBarBottomRight.y) / 2;
      var close = paper.Path.Circle(
        new paper.Point(tabBarTopLeft.x + 15, by),
        5
      );
      close.fillColor = foreColor;
      this.addChild(close);

      var minimise = paper.Path.Circle(
        new paper.Point(tabBarTopLeft.x + 30, by),
        5
      );
      minimise.fillColor = foreColor;
      this.addChild(minimise);

      var maximise = paper.Path.Circle(
        new paper.Point(tabBarTopLeft.x + 45, by),
        5
      );
      maximise.fillColor = foreColor;
      this.addChild(maximise);

      /* var tab = paper.Path.Rectangle(new paper.Rectangle(
        new paper.Point(tabBarTopLeft.x + 60, tabBarBottomRight.y - Browser.TAB_HEIGHT),
        new paper.Point(tabBarTopLeft.x + 170, tabBarBottomRight.y)
      ));
      tab.strokeColor = foreColor;
      tab.strokeWidth = 1;
      tab.fillColor = 'white';
      this.addChild(tab); */

      // Draw the outer frame
      var outer = paper.Path.Rectangle(bounds);
      outer.strokeColor = foreColor;
      outer.strokeWidth = 1;
      outer.fillColor = 'rgba(255,255,255,0)';
      this.addChild(outer);

      // Draw the bar dividers
      var dividerStart = new paper.Point(bounds.left, bounds.top + Browser.TAB_BAR_HEIGHT);
      var dividerEnd = new paper.Point(bounds.right, bounds.top + Browser.TAB_BAR_HEIGHT);

      var dividerTop = paper.Path.Line(dividerStart, dividerEnd);
      dividerTop.strokeColor = foreColor;
      dividerTop.strokeWidth = 1;
      this.addChild(dividerTop);

      dividerStart = new paper.Point(bounds.left, bounds.top + Browser.TAB_BAR_HEIGHT + Browser.BAR_HEIGHT);
      dividerEnd = new paper.Point(bounds.right, bounds.top + Browser.TAB_BAR_HEIGHT + Browser.BAR_HEIGHT);

      var dividerBottom = paper.Path.Line(dividerStart, dividerEnd);
      dividerBottom.strokeColor = foreColor;
      dividerBottom.strokeWidth = 1;
      this.addChild(dividerBottom);

      // Track how much space is taken up by controls
      var x = bounds.left + Browser.BAR_CONTROL_MARGIN;

      // Draw the back button
      var backTopLeft = new paper.Point(x, bounds.top + Browser.TAB_BAR_HEIGHT + Browser.BAR_CONTROL_MARGIN);
      var back = new paper.PointText({
        point: new paper.Point(
          backTopLeft.x + Browser.BAR_CONTROL_SIZE/2,
          backTopLeft.y + Browser.BAR_CONTROL_SIZE - 7
        ),
        content: String.fromCharCode(parseInt('f060', 16)),
        fillColor: foreColor,
        fontSize: 18,
        fontFamily: 'FontAwesome',
        justification: 'center'
      });
      this.addChild(back);
      x += Browser.BAR_CONTROL_SIZE + Browser.BAR_CONTROL_MARGIN;

      // Draw the forward button
      var forwardTopLeft = new paper.Point(x, bounds.top + Browser.TAB_BAR_HEIGHT + Browser.BAR_CONTROL_MARGIN);
      var forward = new paper.PointText({
        point: new paper.Point(
          forwardTopLeft.x + Browser.BAR_CONTROL_SIZE/2,
          forwardTopLeft.y + Browser.BAR_CONTROL_SIZE - 7
        ),
        content: String.fromCharCode(parseInt('f061', 16)),
        fillColor: foreColor,
        fontSize: 18,
        fontFamily: 'FontAwesome',
        justification: 'center'
      });
      this.addChild(forward);
      x += Browser.BAR_CONTROL_SIZE + Browser.BAR_CONTROL_MARGIN;

      // Draw the refresh button
      var refreshTopLeft = new paper.Point(x, bounds.top + Browser.TAB_BAR_HEIGHT + Browser.BAR_CONTROL_MARGIN);
      var refresh = new paper.PointText({
        point: new paper.Point(
          refreshTopLeft.x + Browser.BAR_CONTROL_SIZE/2,
          refreshTopLeft.y + Browser.BAR_CONTROL_SIZE - 6
        ),
        content: String.fromCharCode(parseInt('f021', 16)),
        fillColor: foreColor,
        fontSize: 18,
        fontFamily: 'FontAwesome',
        justification: 'center'
      });
      this.addChild(refresh);
      x += Browser.BAR_CONTROL_SIZE + Browser.BAR_CONTROL_MARGIN;

      // Draw the address bar
      var addressTopLeft = new paper.Point(x, bounds.top + Browser.TAB_BAR_HEIGHT + Browser.BAR_CONTROL_MARGIN);
      var addressBottomRight = new paper.Point(bounds.right - Browser.BAR_CONTROL_MARGIN, bounds.top + Browser.TAB_BAR_HEIGHT + Browser.BAR_CONTROL_MARGIN + Browser.BAR_CONTROL_SIZE);
      var addressRect = new paper.Rectangle(addressTopLeft, addressBottomRight);
      var address = paper.Path.Rectangle(addressRect);
      address.strokeColor = foreColor;
      address.strokeWidth = 1;
      address.fillColor = 'rgba(255,255,255,0)';
      this.addChild(address);

      var url = new paper.PointText({
        point: addressRect.bottomLeft.add(new paper.Point(7, -8)),
        content: properties.address,
        fillColor: foreColor,
        fontSize: 14,
        fontFamily: 'Helvetica Neue'
      });
      this.addChild(url);
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
      var screenRect = this.getScreenRect();

      return [
        // Screen corners
        new SnapPoint(bounds.topLeft, 'corner', 'corner', 1),
        new SnapPoint(bounds.topRight, 'corner', 'corner', 1),
        new SnapPoint(bounds.bottomRight, 'corner', 'corner', 1),
        new SnapPoint(bounds.bottomLeft, 'corner', 'corner', 1),

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

    getTransformHandles(): Array<DragHandle> {

      var topLeft = new DragHandle(this.bounds.topLeft);
      topLeft.cursor = 'nwse-resize';
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

      var topCenter = new DragHandle(this.bounds.topCenter);
      topCenter.cursor = 'ns-resize';
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

      var topRight = new DragHandle(this.bounds.topRight);
      topRight.cursor = 'nesw-resize';
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

      var rightCenter = new DragHandle(this.bounds.rightCenter);
      rightCenter.cursor = 'ew-resize';
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

      var bottomRight = new DragHandle(this.bounds.bottomRight);
      bottomRight.cursor = 'nwse-resize';
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

      var bottomCenter = new DragHandle(this.bounds.bottomCenter);
      bottomCenter.cursor = 'ns-resize';
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

      var bottomLeft = new DragHandle(this.bounds.bottomLeft);
      bottomLeft.cursor = 'nesw-resize';
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

      var leftCenter = new DragHandle(this.bounds.leftCenter);
      leftCenter.cursor = 'ew-resize';
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

    getProperties(): Common.Data.IBrowserProperties {

      return <Common.Data.IBrowserProperties>this.model.properties;
    }
  }
}
