/// <reference path="../../higherframe.ts"/>

module Higherframe.Drawing.Component {

  export interface IDragHandle extends paper.Group {
    position: paper.Point;
    cursor?: Cursor;
    getSnapPoints?: (position: paper.Point) => Array<SnapPoint>;
    onMove?: (position: paper.Point) => paper.Point;
  }

  export class DragHandle extends paper.Group implements IDragHandle {

    constructor(position: paper.Point) {

      super();

      var lineWidth = 1/paper.view.zoom;
      var handleSize = 3/paper.view.zoom;
      var handle = paper.Path.Rectangle(
        new paper.Point(position.x - handleSize, position.y - handleSize),
        new paper.Point(position.x + handleSize, position.y + handleSize)
      );

      handle.strokeColor = '#7ae';
      handle.strokeWidth = lineWidth;
      handle.fillColor = 'white';

      this.addChild(handle);
    }


    /**
     * Derived class should implement
     */

    cursor: Cursor;

    getSnapPoints(position: paper.Point): Array<SnapPoint> {

      return [];
    }

    onMove(position: paper.Point): paper.Point {

      return position;
    }
  }

  export interface IComponentMoveEvent {
    position: paper.Point,
    delta: paper.Point
  };


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
    thumbnail: String,
    resizable: Boolean,
    showBounds: Boolean,
    model: Data.IDrawingModel,

    deserialize?: () => void;
    serialize: () => Data.IDrawingModel;
    update: () => void;
    updateModel: () => void;
    getSnapPoints: () => Array<SnapPoint>;
    getTransformHandles: () => Array<IDragHandle>;
    getDragHandles: () => Array<IDragHandle>;
    setProperty: (string, any) => void;
    onMove?: (IComponentMoveEvent) => void;

    // Drawing properties
    hovered: Boolean,
    active: Boolean,
    focussed: Boolean,

    parts;
    collaborator;
    properties: Array<Object>;
    boundingBox: paper.Group;
    dragHandles: paper.Group;

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
    model: Data.IDrawingModel;

    // Drawing properties
    _hovered: Boolean = false;
    get hovered(): Boolean { return this._hovered; }
    set hovered(value) { this._hovered = value; this.update(); }

    _active: Boolean = false;
    get active(): Boolean { return this._active; }
    set active(value) { this._active = value; this.update(); }

    _focussed: Boolean = false;
    get focussed(): Boolean { return this._focussed; }
    set focussed(value) { this._focussed = value; this.update(); }

    _parts = {};
    get parts() { return this._parts; }
    set parts(value) { this._parts = value; }

    _collaborator: Higherframe.Data.IUser;
    get collaborator(): Higherframe.Data.IUser { return this._collaborator; }
    set collaborator(value) { this._collaborator = value; }

    _properties: Array<Object> = [];
    get properties(): Array<Object> { return this._properties; }
    set properties(value) { this._properties = value; }

    _boundingBox: paper.Group;
    get boundingBox(): paper.Group { return this._boundingBox; }
    set boundingBox(value) { this._boundingBox = value; }

    _dragHandles: paper.Group;
    get dragHandles(): paper.Group { return this._dragHandles; }
    set dragHandles(value) { this._dragHandles = value; }


    constructor(model: Data.IDrawingModel) {

      super();

      // Bind to the model
      this.model = model;
    }

    serialize(): Data.IDrawingModel {

      return this.model;
    }

    setProperty(name: string, value: any) {

      this.model.properties[name] = value;
    }

    // Should be implemented by derived class
    update() {};
    updateModel() {};
    getSnapPoints() { return []; }
    getDragHandles() { return []; }
    getTransformHandles() { return []; }
  }
};
