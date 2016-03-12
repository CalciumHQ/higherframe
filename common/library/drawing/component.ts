
module Common.Drawing {

  export interface IComponentMoveEvent {
    position: paper.Point,
    delta: paper.Point
  };


  /**
   * Defines the a component which can be drawn on a paperjs canvas
   *
   * @extends Paper.Group
   */

  export class Component extends Common.Drawing.Item {

    /**
     * Properties
     */

    id: Common.Drawing.ComponentType = Common.Drawing.ComponentType.Generic;
    title: String = 'Generic Component';
    category: String = '';
    tags: Array<String> = [];
    model: Common.Data.IDrawingModel;

    _collaborator: Common.Data.IUser;
    get collaborator(): Common.Data.IUser { return this._collaborator; }
    set collaborator(value) { this._collaborator = value; }

    _properties: Array<Object> = [];
    get properties(): Array<Object> { return this._properties; }
    set properties(value) { this._properties = value; }

    _boundingBox: paper.Group;
    get boundingBox(): paper.Group { return this._boundingBox; }
    set boundingBox(value) { this._boundingBox = value; }


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

    updateModel(): void {

    }

    setProperty(name: string, value: any) {

      this.model.properties[name] = value;
    }

    onMove(IComponentMoveEvent): void {

    }
  }
};
