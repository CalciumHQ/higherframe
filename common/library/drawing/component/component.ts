
module Common.Drawing.Component {

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
    model: Common.Data.IDrawingModel,

    deserialize?: () => void;
    serialize: () => Common.Data.IDrawingModel;
    update: () => void;
    updateModel: () => void;
    getSnapPoints: () => Array<SnapPoint>;
    getTransformHandles: (color: paper.Color) => Array<IDragHandle>;
    getDragHandles: (color: paper.Color) => Array<IDragHandle>;
    setProperty: (string, any) => void;
    onMove?: (IComponentMoveEvent) => void;

    // Drawing properties
    hovered: Boolean,
    active: Boolean,
    focussed: Boolean,

    parts;
    collaborator;
    properties: Array<Object>;
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
    model: Common.Data.IDrawingModel;

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

    _collaborator: Common.Data.IUser;
    get collaborator(): Common.Data.IUser { return this._collaborator; }
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


    constructor(model: Common.Data.IDrawingModel) {

      super();

      // Bind to the model
      this.model = model;
    }

    serialize(): Common.Data.IDrawingModel {

      return this.model;
    }

    setProperty(name: string, value: any) {

      this.model.properties[name] = value;
    }

    // Should be implemented by derived class
    update() {};
    updateModel() {};
    getSnapPoints() { return []; }
    getDragHandles(color: paper.Color) { return []; }
    getTransformHandles(color: paper.Color) { return []; }
  }
};
