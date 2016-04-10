


module Common.Drawing.Library {

  export class MobileTitlebar extends Drawing.Component {

    // Implement IDefinition members
    id = Drawing.ComponentType.Icon;
    static title = 'Mobile Titlebar';
    static category = 'Mobile';
    tags = [
      'mobile',
      'phone'
    ];
    propertiesController: string = 'MobileTitlebarPropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/mobile-titlebar.props.html';
    properties = [
      {
        label: 'Title',
        controls: [
          {
            model: 'title',
            type: String
          }
        ]
      },
      {
        label: 'Left icon',
        controls: [
          {
            model: 'leftIcon',
            type: String,
            ui: 'icon',
            description: 'The icon to be displayed for the left action.'
          }
        ]
      },
      {
        label: 'Right icon',
        controls: [
          {
            model: 'rightIcon',
            type: String,
            ui: 'icon',
            description: 'The icon to be displayed for the right action.'
          }
        ]
      }
    ];
    resizable = true;
    showBounds = true;

    model: Common.Data.Component;

    icon: paper.PointText;

    // Drawing constants
    static HEIGHT = 40;

    /**
     * Create a new Mobile Titlebar component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.width = properties.width || 220;
      properties.title = properties.title || 'Title';

      // Perform the initial draw
      this.update();
    }


    /**
     * Redraw the component
     */

    update() {

      var properties = this.getProperties();

      // Determine palette
      var theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
      var foreColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefault;
      var borderColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.BorderDefault;

      if (this.active) {

        foreColor = theme.ComponentActive;
        borderColor = theme.BorderActive;
      }

      else if (this.focussed) {

        foreColor = theme.ComponentFocus;
        borderColor = theme.BorderFocus;
      }

      else if (this.hovered) {

        foreColor = theme.ComponentHover;
        borderColor = theme.BorderHover;
      }

      // Remove the old parts
      this.removeChildren();

      var topLeft = new paper.Point(properties.x - properties.width / 2, properties.y - MobileTitlebar.HEIGHT / 2);
      var bottomRight = new paper.Point(properties.x + properties.width / 2, properties.y + MobileTitlebar.HEIGHT / 2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the background
      var background = paper.Path.Rectangle(bounds);
      background.fillColor = 'rgba(0,0,0,0)';
      this.addChild(background);

      // Draw the title
      var text = new paper.PointText({
        point: new paper.Point(bounds.center.x, bounds.center.y + 4),
        content: properties.title,
        fillColor: foreColor,
        fontFamily: 'Helvetica',
        fontSize: 14,
        fontWeight: 600,
        justification: 'center'
      });
      this.addChild(text);

      // Draw the border
      var borderStart = new paper.Point(bounds.bottomLeft);
      var borderEnd = new paper.Point(bounds.bottomRight);

      var border = paper.Path.Line(borderStart, borderEnd);
      border.strokeColor = borderColor;
      border.strokeWidth = 1;
      this.addChild(border);

      // Draw the left icon
      if (properties.leftIcon) {

        var leftIcon = new paper.PointText({
          point: new paper.Point(bounds.leftCenter.x + 10, bounds.center.y + 5),
          content: String.fromCharCode(parseInt(properties.leftIcon, 16)),
          fillColor: foreColor,
          fontSize: 16,
          fontFamily: 'FontAwesome',
          justification: 'left'
        });
        this.addChild(leftIcon);
      }

      // Draw the right icon
      if (properties.rightIcon) {

        var rightIcon = new paper.PointText({
          point: new paper.Point(bounds.rightCenter.x - 10, bounds.center.y + 5),
          content: String.fromCharCode(parseInt(properties.rightIcon, 16)),
          fillColor: foreColor,
          fontSize: 16,
          fontFamily: 'FontAwesome',
          justification: 'right'
        });
        this.addChild(rightIcon);
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

      var properties = this.getProperties();

      return [
        new SnapPoint(this.bounds.leftCenter, 'edge', 'center'),
        new SnapPoint(this.bounds.topCenter, 'center', 'edge'),
        new SnapPoint(this.bounds.rightCenter, 'edge', 'center'),
        new SnapPoint(this.bounds.bottomCenter, 'center', 'edge')
      ];
    }


    /**
     * Calculate the transform handles for the component
     */

    getTransformHandles(color: paper.Color): Array<DragHandle> {

      var rightCenter = new DragHandle(this.bounds.rightCenter);
      rightCenter.cursor = 'ew-resize';
      rightCenter.axis = DragHandleAxis.X;
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

      var leftCenter = new DragHandle(this.bounds.leftCenter);
      leftCenter.cursor = 'ew-resize';
      leftCenter.axis = DragHandleAxis.X;
      leftCenter.getSnapPoints = (position: paper.Point): Array<SnapPoint> => {

        return [new SnapPoint(position, 'edge', 'center')];
      };
      leftCenter.onMove = (position: paper.Point): paper.Point => {

        var properties = this.getProperties();

        this.bounds.topCenter = position;
        properties.x = this.bounds.center.x;
        properties.width = this.bounds.width;
        this.update();

        return this.bounds.leftCenter;
      };

      return [
        rightCenter,
        leftCenter
      ];
    };


    /**
     * Cast the model properties into the correct type
     */

    getProperties(): Common.Data.IMobileTitlebarProperties {

      return <Common.Data.IMobileTitlebarProperties>this.model.properties;
    }
  }
}
