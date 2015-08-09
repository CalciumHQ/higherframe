/// <reference path="../component.ts"/>
/// <reference path="../type.ts"/>

module Higherframe.Drawing.Component.Library {

  export class IPhoneTitlebar extends Drawing.Component.Base implements Drawing.Component.IComponent {

    // Implement IDefinition members
    id = Drawing.Component.Type.IPhoneTitlebar;
    name = 'iPhone titlebar';
    tags = [
      'apple',
      'phone'
    ];
    model: Data.Component;
    resizable = false;
    thumbnail = '/assets/images/components/iphone-thumbnail@2x.png';
    snapPoints = [
      { x: -110, y: -7 },
      { x: 110, y: -7 },
      { x: 110, y: 7 },
      { x: -110, y: 7 }
    ];

    constructor(options: Drawing.Component.IOptions) {

      super(options);
    }

    update() {
      console.log('update iphone titlebar');
    }
  }
}
