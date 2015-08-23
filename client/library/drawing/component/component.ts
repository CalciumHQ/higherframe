/// <reference path="../../higherframe.ts"/>

module Higherframe.Drawing.Component {

  export interface IDragHandle {
    position: IPoint
  }

  /**
   * Defines the interface for a component which can be drawn on a
   * paperjs canvas
   *
   * @extends Paper.Group
   */

  export interface IComponent {

    id: Component.Type,
    title: String,
    preview?: String,
    category?: String,
    tags: Array<String>,
    properties: Array<Object>,
    thumbnail: String,
    resizable: Boolean,
    showBounds: Boolean,
    dragHandles: Array<IDragHandle>,
    model: Data.IDrawingModel,

    // new(options: IOptions)
    update()
    updateModel();
    getSnapPoints(): Array<IPoint>;
    getDragHandles(): Array<{ position: IPoint }>;

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
    properties: Array<Object>;
    thumbnail: String;
    resizable: Boolean;
    showBounds: Boolean;
    dragHandles: Array<IDragHandle> = [];
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
    updateModel() {}
    getSnapPoints() { return []; }
    getDragHandles() { return []; }
  }
};
