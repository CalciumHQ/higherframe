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

  export interface IComponent extends paper.Group {

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

    setComponentColor: (color) => void;

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
    showBounds: Boolean;
    dragHandles: Array<IDragHandle> = [];
    model: Data.IDrawingModel;

    // Drawing properties
    _parts = {};
    get parts() { return this._parts; }
    set parts(value) { this._parts = value; }

    _collaborator: Higherframe.Data.IUser;
    get collaborator(): Higherframe.Data.IUser { return this._collaborator; }
    set collaborator(value) { this._collaborator = value; }

    _properties: Array<Object> = [];
    get properties(): Array<Object> { return this._properties; }
    set properties(value) { this._properties = value; }

    _displayColor: string = '';
    get displayColor(): string { return this._displayColor; }
    set displayColor(value) { this._displayColor = value; }


    constructor(model: Data.IDrawingModel) {

      super();

      // Bind to the model
      this.model = model;
    }

    serialize(): Data.IDrawingModel {

      return this.model;
    }

    // Drawing methods
    setComponentColor(color): void {

      var item = this;

      // Set on the item
      (function loop(item) {

        // A group with children
        if (item.className == 'Group') {

          angular.forEach(item.children, function (child) {

            loop(child);
          });
        }

        // A leaf item
        else {

          if (item.className == 'PointText') {

            item.fillColor = color;
          }

          else if (item.strokeWidth) {

            item.strokeColor = color;
          }

          if (
            item.fillColor && 							// Has fill
            item.fillColor.alpha &&					// Not transparent
            item.fillColor.lightness != 1		// Not white
          ) {

            item.fillColor = color;
          }
        }
      })(item);
    }

    // Will be obscured by child implementation
    update() {};
    updateModel() {};
    getSnapPoints() { return []; }
    getDragHandles() { return []; }
  }
};
