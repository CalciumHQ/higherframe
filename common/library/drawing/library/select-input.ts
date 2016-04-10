


module Common.Drawing.Library {

  export class SelectInput extends Drawing.Component {

    // Implement IDefinition members
    id = Drawing.ComponentType.SelectInput;
    static title = 'Select control';
    static category = 'Form';
    tags = [
      'form',
      'input',
      'select'
    ];
    propertiesController: string = 'SelectInputPropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/select-input.props.html';

    model: Common.Data.Component;


    /**
     * Create a new Select component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = <Common.Data.ISelectInputProperties>this.model.properties;
      properties.width = properties.width || 160;
      properties.placeholder = properties.placeholder || 'Select option';
      properties.fontSize = properties.fontSize || 14;
      properties.fontWeight = properties.fontWeight || 400;
      properties.opacity = (properties.opacity == null) ? 100 : properties.opacity;

      // Perform the initial draw
      this.update();
    }


    /**
     * Redraw the component
     */

    update() {

      var properties = <Common.Data.ISelectInputProperties>this.model.properties;
      var HEIGHT = this.getHeight();

      // Determine palette
      var theme: Common.UI.ITheme = new Common.UI.DefaultTheme();
      var foreColor = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefault;
      var foreColorDark = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefaultDark;
      var foreColorLight = this.collaborator ? new paper.Color(this.collaborator.color) : theme.ComponentDefaultLight;

      if (this.active) {

        foreColor = theme.ComponentActive;
      }

      else if (this.hovered) {

        foreColor = theme.ComponentHover;
        foreColorDark = theme.ComponentHoverDark;
        foreColorLight = theme.ComponentHoverLight;
      }

      // Apply opacity
      if ((this.focussed && !this.hovered) || (!this.active && !this.hovered)) {

        foreColor.alpha = properties.opacity / 100;
        foreColorDark.alpha = properties.opacity / 100;
        foreColorLight.alpha = properties.opacity / 100;
      }

      // Remove the old parts
      this.removeChildren();

      var topLeft = new paper.Point(this.model.properties.x - properties.width/2, this.model.properties.y - HEIGHT/2);
      var bottomRight = new paper.Point(this.model.properties.x + properties.width/2, this.model.properties.y + HEIGHT/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the outer frame
      var outer = paper.Path.Rectangle(bounds);
      outer.strokeColor = foreColor;
      outer.strokeWidth = 1;
      outer.fillColor = 'rgba(255,255,255,1)';

      // Draw the value
      var value = new paper.PointText({
        point: new paper.Point(topLeft.x + 10, topLeft.y + HEIGHT/2 + properties.fontSize/3+1),
        content: properties.value ? properties.value : properties.placeholder,
        fillColor: properties.value ? foreColorDark : foreColorLight,
        fontSize: properties.fontSize,
        fontWeight: properties.fontWeight,
        fontFamily: 'Helvetica'
      });

      // Draw the caret
      var caret = new paper.Path();
      caret.add(new paper.Point(properties.x + (properties.width/2 - 14) - 4.5, properties.y - 2));
      caret.add(new paper.Point(properties.x + (properties.width/2 - 14), properties.y + 3));
      caret.add(new paper.Point(properties.x + (properties.width/2 - 14) + 4.5, properties.y - 2));
      caret.strokeColor = foreColor;
      caret.strokeWidth = 2;
      this.addChild(caret);

      // Group the parts as a component
      this.addChild(outer);
      this.addChild(value);
      this.addChild(caret);
    }

    /**
     * Update model with the state of the view component
     */

     updateModel() {

       var properties = this.getProperties();
       properties.x = this.bounds.center.x;
       properties.y = this.bounds.center.y;
       properties.width = this.bounds.width;
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

        this.bounds.rightCenter.x = position.x;

        this.updateModel();
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

        this.bounds.leftCenter.x = position.x;

        this.updateModel();
        this.update();

        return this.bounds.leftCenter;
      };

      return [
        rightCenter,
        leftCenter
      ];
    };


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<SnapPoint> {

      return [
        new SnapPoint(this.bounds.leftCenter, 'edge', 'center'),
        new SnapPoint(this.bounds.topCenter, 'center', 'edge'),
        new SnapPoint(this.bounds.rightCenter, 'edge', 'center'),
        new SnapPoint(this.bounds.bottomCenter, 'center', 'edge')
      ];
    }


    /**
     * Cast the model properties into the correct type
     */

    getProperties(): Common.Data.ISelectInputProperties {

      return <Common.Data.ISelectInputProperties>this.model.properties;
    }


    /**
     * Calculate the height of the component
     */

    getHeight(): number {

      var properties = this.getProperties();
      return 2*Number(properties.fontSize);
    }
  }
}
