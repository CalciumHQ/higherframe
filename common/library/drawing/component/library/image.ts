


module Common.Drawing.Component.Library {

  export class Image extends Drawing.Component.Component {

    // Implement IDefinition members
    id = Drawing.Component.Type.Image;
    static title = 'Image';
    static category = 'Basic';
    tags = [
      'basic',
      'image',
      'picture'
    ];
    properties = [
      {
        label: 'Image',
        controls: [
          {
            model: 'media',
            type: String,
            ui: 'file',
            description: 'The image to be displayed.'
          }
        ],
      }
    ];

    model: Common.Data.Component;


    /**
     * Create a new Button component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.width = properties.width || 200;
      properties.height = properties.height || 150;
      properties.cornerRadius = properties.cornerRadius || 0;

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

      // Draw the placeholder or the image
      if (!properties.media) {

        let shape = paper.Path.Rectangle(bounds, parseInt('' + properties.cornerRadius));
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

        var raster = new paper.Raster((<Common.Data.IMedia>properties.media)._id);
        raster.position = new paper.Point(bounds.center.x, bounds.center.y);
        raster.scale(bounds.width / raster.width, bounds.height / raster.height);
        this.addChild(raster);

        let outline = paper.Path.Rectangle(bounds);
        outline.strokeColor = foreColor;
        outline.strokeWidth = (!this.active && !this.focussed && !this.hovered) ? 0 : 1.5;
        outline.fillColor = 'rgba(0,0,0,0)';
        this.addChild(outline);
      }
    }


    /**
     * Update model with the state of the view component
     */

    updateModel() {

      var properties = this.getProperties();
      properties.x = this.bounds.topLeft.x;
      properties.y = this.bounds.topLeft.y;
      properties.width = this.bounds.width;
      properties.height = this.bounds.height;
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

    getTransformHandles(color: paper.Color): Array<IDragHandle> {

      var topLeft = new DragHandle(this.bounds.topLeft, color);
      topLeft.cursor = 'nwse-resize';
      topLeft.onMove = (position: paper.Point): paper.Point => {

        this.bounds.topLeft = position;
        return this.bounds.topLeft;
      };

      var topCenter = new DragHandle(this.bounds.topCenter, color);
      topCenter.cursor = 'ns-resize';
      topCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.topCenter.y = position.y;
        return this.bounds.topCenter;
      };

      var topRight = new DragHandle(this.bounds.topRight, color);
      topRight.cursor = 'nesw-resize';
      topRight.onMove = (position: paper.Point): paper.Point => {

        this.bounds.topRight = position;
        return this.bounds.topRight;
      };

      var rightCenter = new DragHandle(this.bounds.rightCenter, color);
      rightCenter.cursor = 'ew-resize';
      rightCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.rightCenter.x = position.x;
        return this.bounds.rightCenter;
      };

      var bottomRight = new DragHandle(this.bounds.bottomRight, color);
      bottomRight.cursor = 'nwse-resize';
      bottomRight.onMove = (position: paper.Point): paper.Point => {

        this.bounds.bottomRight = position;
        return this.bounds.bottomRight;
      };

      var bottomCenter = new DragHandle(this.bounds.bottomCenter, color);
      bottomCenter.cursor = 'ns-resize';
      bottomCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.bottomCenter.y = position.y;
        return this.bounds.bottomCenter;
      };

      var bottomLeft = new DragHandle(this.bounds.bottomLeft, color);
      bottomLeft.cursor = 'nesw-resize';
      bottomLeft.onMove = (position: paper.Point): paper.Point => {

        this.bounds.bottomLeft = position;
        return this.bounds.bottomLeft;
      };

      var leftCenter = new DragHandle(this.bounds.leftCenter, color);
      leftCenter.cursor = 'ew-resize';
      leftCenter.onMove = (position: paper.Point): paper.Point => {

        this.bounds.leftCenter.x = position.x;
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

    getProperties(): Common.Data.IImageProperties {

      return <Common.Data.IImageProperties>this.model.properties;
    }
  }
}
