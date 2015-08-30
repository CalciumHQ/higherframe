/// <reference path="../../higherframe.ts"/>

module Higherframe.Drawing.Component {

  export interface IDragHandle {
    position: IPoint,
    move?: (position: paper.Point) => paper.Point
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
    deserialize?: () => void;
    serialize: () => Data.IDrawingModel;
    update: () => void;
    updateModel: () => void;
    getSnapPoints: () => Array<IPoint>;
    getDragHandles: () => Array<{ position: IPoint }>;

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
    }

    serialize(): Data.IDrawingModel {

      return this.model;
    }

    // Will be obscured by child implementation
    update() {};
    updateModel() {};
    getSnapPoints() { return []; }
    getDragHandles() { return []; }
  }
};
