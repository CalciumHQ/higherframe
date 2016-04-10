
module Common.Drawing.Library {

  export class Checkbox extends Drawing.Component {

    // Implement IDefinition members
    id = Drawing.ComponentType.Checkbox;
    static title = 'Checkbox control';
    static category = 'Form';
    tags = [
      'form',
      'input',
      'checkbox',
      'tick'
    ];
    propertiesController: string = 'CheckboxPropertiesController as PropsCtrl';
    propertiesTemplateUrl: string = '/library/drawing/component/library/checkbox.props.html';

    model: Common.Data.Component;


    /**
     * Create a new Select component
     */

    constructor(model: Common.Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.label = properties.label || 'Label';
      properties.value = properties.value ? true : false;
      properties.opacity = (properties.opacity == null) ? 100 : properties.opacity;
      properties.fontSize = properties.fontSize || 14;
      properties.fontWeight = properties.fontWeight || 400;

      // Perform the initial draw
      this.update();
    }


    /**
     * Redraw the component
     */

    update() {

      var properties = this.getProperties();
      let size = 14;

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
      }

      // Remove the old parts
      this.removeChildren();

      // Draw the box
      var topLeft = new paper.Point(properties.x, properties.y);
      var bottomRight = new paper.Point(properties.x + size, properties.y + size);
      var bounds = new paper.Rectangle(topLeft, bottomRight);
      var box = paper.Path.Rectangle(bounds);
      box.strokeColor = foreColor;
      box.strokeWidth = 1;
      box.fillColor = 'rgba(255,255,255,1)';
      this.addChild(box);

      // Draw the check
      if (properties.value) {

        var check = new paper.Path();
        check.add(new paper.Point(properties.x + size/2 - 4, properties.y + size/2 - 0));
        check.add(new paper.Point(properties.x + size/2 - 1, properties.y + size/2 + 3));
        check.add(new paper.Point(properties.x + size/2 + 4, properties.y + size/2 - 3));
        check.strokeColor = foreColor;
        check.strokeWidth = 2;
        this.addChild(check);
      }

      // Draw the value
      var value = new paper.PointText({
        point: new paper.Point(properties.x + size + 7, topLeft.y + size/2 + properties.fontSize/3),
        content: properties.label,
        fillColor: foreColorDark,
        fontSize: properties.fontSize,
        fontWeight: properties.fontWeight,
        fontFamily: 'Helvetica Neue'
      });
      this.addChild(value);
    }

    /**
     * Update model with the state of the view component
     */

    updateModel() {

      this.model.properties.x = this.bounds.topLeft.x;
      this.model.properties.y = this.bounds.topLeft.y + 1;
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<SnapPoint> {

      var properties = <Common.Data.ITextInputProperties>this.model.properties;

      return [
        new SnapPoint(this.bounds.topLeft, 'corner', 'corner'),
        new SnapPoint(this.bounds.topRight, 'corner', 'corner'),
        new SnapPoint(this.bounds.bottomLeft, 'corner', 'corner'),
        new SnapPoint(this.bounds.bottomRight, 'corner', 'corner')
      ];
    }


    /**
     * Cast the model properties into the correct type
     */

    getProperties(): Common.Data.ICheckboxProperties {

      return <Common.Data.ICheckboxProperties>this.model.properties;
    }
  }
}
