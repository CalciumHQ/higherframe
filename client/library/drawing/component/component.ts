/// <reference path="../../higherframe.ts"/>

module Higherframe.Drawing.Component {

  /**
   * Defines the interface for a component which can be drawn on a
   * paperjs canvas
   *
   * @extends Paper.Group
   */

  export interface IComponent {

    id: Component.Type,
    title: String,
    tags: Array<String>,
    thumbnail: String,
    resizable: Boolean,
    snapPoints: Array<IPoint>,
    model: Data.IDrawingModel,

    // new(options: IOptions)
    update()

    // Provide definitions for paper.Item methods that we need in lieu
    // of a definition file for the interface
    position: paper.Point,
    remove(): boolean,
  }


  /**
   * Provides boilerplate for creating components
   */

  export class Base extends paper.Group implements IComponent {

    id: Component.Type;
    title: String;
    tags: Array<String>;
    thumbnail: String;
    resizable: Boolean;
    snapPoints: Array<IPoint>;
    model: Data.IDrawingModel;

    constructor(model: Data.IDrawingModel) {

      super();

      // Bind to the model
      this.model = model;

      // Perform the initial draw
      this.update();
    }


    /**
     * Will be obscured by descendant class implementation
     */

    update() {}
  }
};
