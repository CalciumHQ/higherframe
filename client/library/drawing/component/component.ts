/// <reference path="../../higherframe.ts"/>

module Higherframe.Drawing.Component {

  /**
   * A component
   *
   * @extends Paper.Group
   */

  export interface IComponent {

    id: Component.Type,
    name: String,
    tags: Array<String>,
    thumbnail: String,
    resizable: Boolean,
    snapPoints: Array<IPoint>,
    model: Data.IDrawingModel

    // new(options: IOptions)
    update()
  }


  /**
   * Provides boilerplate for creating components
   */

  export class Base {
    remoteId: String;

    constructor(options: IOptions) {

      // Set properties on the component
      // component.properties = options;

      // Perform the initial draw
      this.update();
    }


    /**
     * Will be obscured by descendant class implementation
     */

    update() {}
  }
};
