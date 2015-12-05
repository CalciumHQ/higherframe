/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class MobileTitlebar extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.Icon;
    static title = 'Mobile Titlebar';
    static preview = '/assets/images/components/iphone-titlebar.svg';
    static category = 'Mobile';
    tags = [
      'mobile',
      'phone'
    ];
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
    showBounds = false;

    model: Data.Component;

    icon: paper.PointText;


    /**
     * Create a new Mobile Titlebar component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.width = properties.width || 220;
      properties.height = properties.height || 40;

      // Perform the initial draw
      this.update();
    }


    /**
     * Redraw the component
     */

    update() {

      var properties = this.getProperties();

      // Determine palette
      var theme: Higherframe.UI.ITheme = new Higherframe.UI.DefaultTheme();
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

      var topLeft = new paper.Point(properties.x - properties.width / 2, properties.y - properties.height / 2);
      var bottomRight = new paper.Point(properties.x + properties.width / 2, properties.y + properties.height / 2);
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
      border.strokeWidth = 1.5;
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
      properties.width = this.bounds.width;
      properties.height = this.bounds.height;
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<SnapPoint> {

      var properties = this.getProperties();

      return [
        new SnapPoint(this.bounds.leftCenter),
        new SnapPoint(this.bounds.topCenter),
        new SnapPoint(this.bounds.rightCenter),
        new SnapPoint(this.bounds.bottomCenter)
      ];
    }


    /**
     * Calculate the transform handles for the component
     */

    getTransformHandles(): Array<IDragHandle> {

      return [];
    };


    /**
     * Calculate the drag handles for the component
     */

    getDragHandles(): Array<IDragHandle> {

      return [];
    }


    /**
     * Cast the model properties into the correct type
     */

    getProperties(): Higherframe.Data.IMobileTitlebarProperties {

      return <Higherframe.Data.IMobileTitlebarProperties>this.model.properties;
    }
  }
}
