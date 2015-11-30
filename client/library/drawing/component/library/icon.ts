/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class Icon extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.Icon;
    static title = 'Icon';
    static preview = '/assets/images/components/rectangle.svg';
    static category = 'Basic';
    tags = [
      'basic',
      'image',
      'picture'
    ];
    properties = [
      {
        label: 'Icon',
        controls: [
          {
            model: 'icon',
            type: String,
            ui: 'select',
            options: _.map(Higherframe.UI.FontAwesome.getIcons(), (icon) => {

              return {
                label: icon.name,
                value: icon.unicode
              };
            }),
            description: 'The icon to be displayed.'
          }
        ]
      },
      {
        label: 'Size',
        controls: [
          {
            model: 'fontSize',
            type: Number
          }
        ]
      }
    ];
    resizable = true;
    showBounds = false;

    model: Data.Component;

    icon: paper.PointText;


    /**
     * Create a new Icon component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.width = properties.width || 64;
      properties.height = properties.height || 64;
      properties.fontSize = properties.fontSize || 32;

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
      var backColor = theme.ShadingDefault;

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

      var topLeft = new paper.Point(properties.x, properties.y);
      var bottomRight = new paper.Point(properties.x + properties.width, properties.y + properties.height);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the placeholder or the icon
      if (!properties.icon) {

        let shape = paper.Path.Rectangle(bounds);
        shape.strokeColor = foreColor;
        shape.strokeWidth = 1.5;
        shape.fillColor = 'rgba(0,0,0,0)';
        this.addChild(shape);

        let crossOne = new paper.Path();
        crossOne.add(bounds.topLeft);
        crossOne.add(bounds.bottomRight);
        crossOne.strokeColor = foreColor;
        crossOne.strokeWidth = 1.5;
        this.addChild(crossOne);

        let crossTwo = new paper.Path();
        crossTwo.add(bounds.topRight);
        crossTwo.add(bounds.bottomLeft);
        crossTwo.strokeColor = foreColor;
        crossTwo.strokeWidth = 1.5;
        this.addChild(crossTwo);
      }

      else {

        // Draw the text
        this.icon = new paper.PointText({
          point: new paper.Point(properties.x, properties.y),
          content: String.fromCharCode(parseInt(properties.icon, 16)),
          fillColor: foreColor,
          fontSize: properties.fontSize,
          fontFamily: 'FontAwesome',
          justification: 'center'
        });
        this.addChild(this.icon);
      }
    }


    /**
     * Update model with the state of the view component
     */

    updateModel() {

      var properties = this.getProperties();
      properties.x = this.icon.point.x;
      properties.y = this.icon.point.y;
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

    getProperties(): Higherframe.Data.IIconProperties {

      return <Higherframe.Data.IIconProperties>this.model.properties;
    }
  }
}
