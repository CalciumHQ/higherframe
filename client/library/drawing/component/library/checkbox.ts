/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class Checkbox extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.TextInput;
    static title = 'Checkbox control';
    static preview = '/assets/images/components/iphone.svg';
    static category = 'Form';
    tags = [
      'form',
      'input',
      'checkbox',
      'tick'
    ];
    properties = [
      {
        label: 'Label',
        model: 'label',
        type: String,
        description: 'Set the label on the checkbox.'
      },
      {
        label: 'Checked',
        model: 'value',
        type: Boolean,
        description: 'Set the value of the input.'
      },
      {
        label: 'Font size',
        model: 'fontSize',
        type: Number,
        description: 'Set the font size of the input.'
      }
    ];
    resizable = false;
    showBounds = false;

    model: Data.Component;


    /**
     * Create a new Select component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);

      var properties = this.getProperties();
      properties.label = 'Label';
      properties.value = properties.value ? true : false;
      properties.fontSize = properties.fontSize || 14;

      // Perform the initial draw
      this.update();
    }


    /**
     * Redraw the component
     */

    update() {

      var properties = this.getProperties();
      let size = 14;

      // Remove the old parts
      this.removeChildren();

      // Draw the box
      var topLeft = new paper.Point(this.model.properties.x - size/2, this.model.properties.y - size/2);
      var bottomRight = new paper.Point(this.model.properties.x + size/2, this.model.properties.y + size/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);
      var box = paper.Path.Rectangle(bounds);
      box.strokeColor = '#888';
      box.strokeWidth = 1.5;
      box.fillColor = 'rgba(255,255,255,1)';
      this.addChild(box);

      // Draw the check
      if (properties.value) {

        var check = new paper.Path();
        check.add(new paper.Point(properties.x - 4, properties.y - 0));
        check.add(new paper.Point(properties.x - 1, properties.y + 3));
        check.add(new paper.Point(properties.x + 4, properties.y - 3));
        check.strokeColor = '#888';
        check.strokeWidth = 2;
        this.addChild(check);
      }

      // Draw the value
      var value = new paper.PointText({
        point: new paper.Point(properties.x + size/2 + 7, topLeft.y + size/2 + properties.fontSize/3),
        content: properties.label,
        fillColor: 'black',
        fontSize: properties.fontSize,
        fontFamily: 'Myriad Pro'
      });
      this.addChild(value);
    }

    /**
     * Update model with the state of the view component
     */

    updateModel() {

      this.model.properties.x = this.position.x;
      this.model.properties.y = this.position.y;
    }


    /**
     * Calculate the snap points for the component
     */

    getSnapPoints(): Array<IPoint> {

      var snapPoints = [];
      var properties = <Higherframe.Data.ITextInputProperties>this.model.properties;
      var width = properties.width;

      // Corners
      /*snapPoints.push(this.position.add(new paper.Point({ x: -(width/2), y: -(height/2) })));
      snapPoints.push(this.position.add(new paper.Point({ x: (width/2), y: -(height/2) })));
      snapPoints.push(this.position.add(new paper.Point({ x: (width/2), y: (height/2) })));
      snapPoints.push(this.position.add(new paper.Point({ x: -(width/2), y: (height/2) })));*/

      return snapPoints;
    }


    /**
     * Calculate the drag points for the component
     */

    getDragHandles(): Array<IDragHandle> {

      return [];
    }


    /**
     * Cast the model properties into the correct type
     */

    getProperties(): Higherframe.Data.ICheckboxProperties {

      return <Higherframe.Data.ICheckboxProperties>this.model.properties;
    }
  }
}
