/// <reference path="../../../higherframe.ts"/>

module Higherframe.Drawing.Component.Library {

  export class IPhone extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.IPhone;
    name = 'iPhone';
    tags = [
      'container',
      'apple',
      'phone'
    ];
    model: Data.Component;
    resizable = false;
    thumbnail = '/assets/images/components/iphone-thumbnail@2x.png';
    snapPoints = [
      { x: -116, y: -232 },		// Bounding box
      { x: 116, y: -232 },
      { x: 116, y: 232 },
      { x: -116, y: 232 },
      { x: -110, y: -184 },		// Screen corners
      { x: 110, y: -184 },
      { x: 110, y: 162 },
      { x: -110, y: 162 },
    ];

    constructor(options: Drawing.Component.IOptions) {

      super(options);
    }

    update() {
      console.log('update iphone')
    }
  }
}
