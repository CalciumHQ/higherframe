/// <reference path="../../../../typings/paper/paper.d.ts"/>
/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class SelectInput extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.SelectInput;
    static title = 'Select control';
    static preview = '/assets/images/components/iphone.svg';
    static category = 'Form';
    tags = [
      'form',
      'input',
      'select'
    ];
    properties = [
      {
        label: 'Placeholder',
        model: 'placeholder',
        type: String,
        description: 'Set the placeholder of the input.'
      },
      {
        label: 'Value',
        model: 'value',
        type: String,
        description: 'Set the value of the input.'
      },
      {
        label: 'Font size',
        model: 'fontSize',
        type: Number,
        description: 'Set the font size of the input.'
      }
    ];
    resizable = true;
    showBounds = false;

    model: Data.Component;


    /**
     * Create a new Select component
     */

    constructor(model: Data.IDrawingModel) {

      super(model);

      var properties = <Higherframe.Data.ITextInputProperties>this.model.properties;
      properties.width = properties.width || 160;
      properties.placeholder = properties.placeholder || 'Select option';
      properties.fontSize = properties.fontSize || 14;

      // Perform the initial draw
      this.update();
    }


    /**
     * Redraw the component
     */

    update() {

      var properties = <Data.ITextInputProperties>this.model.properties;
      var HEIGHT = this.getHeight();

      // Remove the old parts
      this.removeChildren();

      var topLeft = new paper.Point(this.model.properties.x - properties.width/2, this.model.properties.y - HEIGHT/2);
      var bottomRight = new paper.Point(this.model.properties.x + properties.width/2, this.model.properties.y + HEIGHT/2);
      var bounds = new paper.Rectangle(topLeft, bottomRight);

      // Draw the outer frame
      var outer = paper.Path.Rectangle(bounds);
      outer.strokeColor = '#888';
      outer.strokeWidth = 1.5;
      outer.fillColor = 'rgba(255,255,255,1)';

      // Draw the value
      var value = new paper.PointText({
        point: new paper.Point(topLeft.x + 10, topLeft.y + HEIGHT/2 + properties.fontSize/3+1),
        content: properties.value ? properties.value : properties.placeholder,
        fillColor: properties.value ? 'black' : '#aaa',
        fontSize: properties.fontSize,
        fontFamily: 'Myriad Pro'
      });

      // Draw the caret
      var caret = new paper.Path();
      caret.add(new paper.Point(properties.x + (properties.width/2 - 14) - 4.5, properties.y - 2));
      caret.add(new paper.Point(properties.x + (properties.width/2 - 14), properties.y + 3));
      caret.add(new paper.Point(properties.x + (properties.width/2 - 14) + 4.5, properties.y - 2));
      caret.strokeColor = '#888';
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
      var height = this.getHeight();

      // Corners
      snapPoints.push(this.position.add(new paper.Point({ x: -(width/2), y: -(height/2) })));
      snapPoints.push(this.position.add(new paper.Point({ x: (width/2), y: -(height/2) })));
      snapPoints.push(this.position.add(new paper.Point({ x: (width/2), y: (height/2) })));
      snapPoints.push(this.position.add(new paper.Point({ x: -(width/2), y: (height/2) })));

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

    getProperties(): Higherframe.Data.ITextInputProperties {

      return <Higherframe.Data.ITextInputProperties>this.model.properties;
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
