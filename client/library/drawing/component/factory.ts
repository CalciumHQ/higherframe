/// <reference path="../../higherframe.ts" />

module Higherframe.Drawing.Component {

  /**
   * Create a drawing component and binds to a component data model.
   */

  export function factory(type: Type, model?: Data.IDrawingModel, remoteId?: String): IComponent {

    // Get the component definition and create an instance
    var component: IComponent = get(type);

    // Add a reference to the model
    component.model = model;

    return component;
  }


  /**
   * Creates a new component for a given component type
   */

  function get(type: Type): IComponent {

    // Passing an enum value to the enum returns the corresponding
    // enum key. Use this to return the requested component constructor.
    var id = Component.Type[type];
    var comConstr = Higherframe.Drawing.Component.Library[id];

    if (!comConstr) {

      throw `There isn't a registered component with id "${id}".`;
    }


    return new comConstr();
  }
}
