
module Common.Drawing.Library {

  export class Ellipse extends Drawing.Component {

    // Implement IDefinition members
    id = Drawing.ComponentType.Ellipse;
    static title = 'Ellipse';
    static category = 'Basic';
    tags = [
      'basic',
      'shape',
      'flowchart'
    ];
    propertiesController: string = 'EllipsePropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/ellipse.props.html';

    model: Common.Data.Component;


    /**
     * Create a new Ellipse component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.width = properties.width || 160;
      properties.height = properties.height || 120;
      properties.opacity = (properties.opacity == null) ? 100 : properties.opacity;

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

      if (this.active) {

        foreColor = theme.ComponentActive;
      }

      else if (this.focussed) {

        foreColor = theme.ComponentFocus;
      }

      else if (this.hovered) {

        foreColor = theme.ComponentHover;
      }

      // Apply opacity
      if (this.focussed || (!this.active && !this.hovered)) {

        foreColor.alpha = properties.opacity / 100;
      }

      // Remove the old parts
      this.removeChildren();

      var topLeft = new paper.Point(properties.x - (properties.width/2), properties.y - (properties.height/2));
      var bottomRight = new paper.Point(properties.x + (properties.width/2), properties.y + (properties.height/2));
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the shape
      var shape = paper.Path.Ellipse(bounds);
      shape.strokeColor = foreColor;
      shape.strokeWidth = 1;
      shape.fillColor = 'rgba(0,0,0,0)';

      // Group the parts as a component
      this.addChild(shape);
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

    getProperties(): Common.Data.IEllipseProperties {

      return <Common.Data.IEllipseProperties>this.model.properties;
    }
  }
}
