


module Common.Drawing.Library {

  export class Image extends Drawing.Component {

    // Implement IDefinition members
    id = Drawing.ComponentType.Image;
    static title = 'Image';
    static category = 'Basic';
    tags = [
      'basic',
      'image',
      'picture'
    ];
    propertiesController: string = 'ImagePropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/image.props.html';

    model: Common.Data.Component;


    /**
     * Create a new Button component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.width = properties.width || 200;
      properties.height = properties.height || 150;
      properties.opacity = (properties.opacity == null) ? 100 : properties.opacity;
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

      else if (this.hovered) {

        foreColor = theme.ComponentHover;
      }

      // Apply opacity
      if ((this.focussed && !this.hovered) || (!this.active && !this.hovered)) {

        foreColor.alpha = properties.opacity / 100;
      }

      // Remove the old parts
      this.removeChildren();

      var topLeft = new paper.Point(properties.x - properties.width/2, properties.y - properties.height/2);
      var bottomRight = new paper.Point(properties.x + properties.width/2, properties.y + properties.height/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the placeholder or the image
      if (!properties.media) {

        let shape = paper.Path.Rectangle(bounds, parseInt('' + properties.cornerRadius));
        shape.strokeColor = foreColor;
        shape.strokeWidth = 1;
        shape.fillColor = 'rgba(0,0,0,0)';
        this.addChild(shape);

        let crossOne = new paper.Path();
        crossOne.add(bounds.topLeft);
        crossOne.add(bounds.bottomRight);
        crossOne.strokeColor = foreColor;
        crossOne.strokeWidth = 1;
        this.addChild(crossOne);

        let crossTwo = new paper.Path();
        crossTwo.add(bounds.topRight);
        crossTwo.add(bounds.bottomLeft);
        crossTwo.strokeColor = foreColor;
        crossTwo.strokeWidth = 1;
        this.addChild(crossTwo);
      }

      else {

        var raster = new paper.Raster((<Common.Data.IMedia>properties.media)._id);
        raster.position = new paper.Point(bounds.center.x, bounds.center.y);
        raster.scale(bounds.width / raster.width, bounds.height / raster.height);
        this.addChild(raster);

        let outline = paper.Path.Rectangle(bounds);
        outline.strokeColor = foreColor;
        outline.strokeWidth = (!this.active && !this.focussed && !this.hovered) ? 0 : 1;
        outline.fillColor = 'rgba(0,0,0,0)';
        this.addChild(outline);
      }
    }


    /**
     * Update model with the state of the view component
     */

    updateModel() {

      var properties = this.getProperties();
      properties.x = this.bounds.center.x;
      properties.y = this.bounds.center.y;
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

      var topLeft = new DragHandle(this.bounds.topLeft);
      topLeft.cursor = 'nwse-resize';
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
      topCenter.axis = DragHandleAxis.Y;
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
      rightCenter.axis = DragHandleAxis.X;
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
      bottomCenter.axis = DragHandleAxis.Y;
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
      leftCenter.axis = DragHandleAxis.X;
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

    getProperties(): Common.Data.IImageProperties {

      return <Common.Data.IImageProperties>this.model.properties;
    }
  }
}
