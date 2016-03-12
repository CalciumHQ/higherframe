
module Common.Drawing {

  /**
   * Factory for drawing components
   */

  export class Factory {

    /**
     * Create a drawing component from a component data model.
     */
    static fromModel(model?: Common.Data.Component): Drawing.Component {

      // Get the component type
      var type = ComponentType[<string>model.type];

      // Get the component definition and create an instance
      var component: Drawing.Component = this.get(type, model);

      return component;
    }


    /**
     * Creates a new component for a given component type
     */

    private static get(type: ComponentType, model: Common.Data.Component): Component {

      // Passing an enum value to the enum returns the corresponding
      // enum key. Use this to return the requested component constructor.
      var id = Common.Drawing.ComponentType[type];
      var comConstr = Common.Drawing.Library[id];

      if (!comConstr) {

        throw `There isn't a registered component with id "${id}".`;
      }

      return new comConstr(model);
    }
  }
}
