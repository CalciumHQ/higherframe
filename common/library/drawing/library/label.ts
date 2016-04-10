


module Common.Drawing.Library {

  export class Label extends Drawing.Component {

    // Implement IDefinition members
    id = Drawing.ComponentType.Label;
    static title = 'Label';
    static category = 'Basic';
    tags = [
      'basic',
      'text',
      'label',
      'string'
    ];
    propertiesController: string = 'LabelPropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/label.props.html';

    model: Common.Data.Component;
    textItem: paper.PointText;


    /**
     * Create a new Label component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      var theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
      properties.text = properties.text || 'Label';
      properties.fontFamily = properties.fontFamily || 'Helvetica Neue';
      properties.fontWeight = properties.fontWeight || 400;
      properties.fontSize = properties.fontSize || 14;
      properties.lineHeight = properties.lineHeight || 20;
      properties.justification = properties.justification || 'left';
      properties.area = (properties.area == null) ? true : properties.area;
      properties.opacity = (properties.opacity == null) ? 100 : properties.opacity;
      properties.fillColor = (properties.fillColor == null) ? theme.ComponentDefault.toCSS(true) : properties.fillColor;

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
      var foreColor = this.collaborator ? new paper.Color(this.collaborator.color) : new paper.Color(properties.fillColor);

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

      var topLeft = new paper.Point(properties.x - (properties.width/2), properties.y - (properties.height/2));
      var bottomRight = new paper.Point(properties.x + (properties.width/2), properties.y + (properties.height/2));
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Area text
      if (properties.area) {

        var rect = paper.Path.Rectangle(bounds);
        rect.fillColor = 'rgba(255,255,255,0.0000000001)';
        this.addChild(rect);

        // Draw the text
        var text = new paper.AreaText({
          rectangle: bounds,
          content: properties.text,
          fillColor: foreColor,
          fontSize: properties.fontSize,
          fontWeight: properties.fontWeight,
          fontFamily: properties.fontFamily,
          leading: properties.lineHeight
        });
        this.addChild(text);
      }

      // Point text
      else {

        // Draw the text
        this.textItem = new paper.PointText({
          point: new paper.Point(properties.x, properties.y),
          content: properties.text,
          fillColor: foreColor,
          fontSize: properties.fontSize,
          fontWeight: properties.fontWeight,
          fontFamily: 'Helvetica',
        });
        this.addChild(this.textItem);
      }
    }

    /**
     * Update model with the state of the view component
     */

    updateModel() {

      var properties = this.getProperties();
      if (!properties.area) {

        this.model.properties.x = this.textItem.point.x;
        this.model.properties.y = this.textItem.point.y;
      }
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<SnapPoint> {

      return [
        new SnapPoint(this.bounds.topLeft, 'corner', 'corner'),
        new SnapPoint(this.bounds.topRight, 'corner', 'corner'),
        new SnapPoint(this.bounds.bottomLeft, 'corner', 'corner'),
        new SnapPoint(this.bounds.bottomRight, 'corner', 'corner')
      ];
    }


    /**
     * Calculate the transform handles for the component
     */

    getTransformHandles(color: paper.Color): Array<DragHandle> {

      // No handles if a point text
      var properties = this.getProperties();
      if (!properties.area) {

        return [];
      }

      // Return handles if an area text
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
      topCenter.axis = DragHandleAxis.Y;
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
      bottomCenter.axis = DragHandleAxis.Y;
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
      leftCenter.axis = DragHandleAxis.X;
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

    getProperties(): Common.Data.ILabelProperties {

      return <Common.Data.ILabelProperties>this.model.properties;
    }
  }
}
