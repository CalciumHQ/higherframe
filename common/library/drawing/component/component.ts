
module Common.Drawing.Component {

  export interface IComponentMoveEvent {
    position: paper.Point,
    delta: paper.Point
  };


  /**
   * Defines the a component which can be drawn on a paperjs canvas
   *
   * @extends Paper.Group
   */

  export class Component extends paper.Group {

    /**
     * Properties
     */

    id: Common.Drawing.Component.Type = Common.Drawing.Component.Type.Generic;
    title: String = 'Generic Component';
    category: String = '';
    tags: Array<String> = [];
    model: Common.Data.IDrawingModel;

    _hovered: Boolean = false;
    get hovered(): Boolean { return this._hovered; }
    set hovered(value) { this._hovered = value; this.update(); }

    _active: Boolean = false;
    get active(): Boolean { return this._active; }
    set active(value) { this._active = value; this.update(); }

    _focussed: Boolean = false;
    get focussed(): Boolean { return this._focussed; }
    set focussed(value) { this._focussed = value; this.update(); }

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


    /**
     * Methods
     */

    // Provide definitions for paper.Item methods that we need in lieu
    // of a definition file for the interface
    position: paper.Point;


    /**
     * Constructor
     */

    constructor(model: Common.Data.IDrawingModel) {

      super();

      // Bind to the model
      this.model = model;
    }

    serialize(): Common.Data.IDrawingModel {

      return this.model;
    }

    deserialize(): void {

    }

    update(): void {

    }

    updateModel(): void {

    }

    setProperty(name: string, value: any) {

      this.model.properties[name] = value;
    }

    getSnapPoints(): Array<SnapPoint> {

      return [];
    }

    getTransformHandles(color: paper.Color): Array<IDragHandle> {

      return [];
    }

    getDragHandles(color: paper.Color): Array<IDragHandle> {

      return [];
    }

    onMove(IComponentMoveEvent): void {

    }
  }
};
