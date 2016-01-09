
module Common.Drawing.Component {

  /**
   * Factory for drawing components
   */

  export class Factory {

    /**
     * Create a drawing component from a component data model.
     */
    static fromModel(model?: Common.Data.Component): Drawing.Component.IComponent {

      // Get the component type
      var type = Type[<string>model.type];

      // Get the component definition and create an instance
      var component: Drawing.Component.IComponent = this.get(type, model);

      return component;
    }


    /**
     * Creates a new component for a given component type
     */

    private static get(type: Type, model: Common.Data.Component): IComponent {

      // Passing an enum value to the enum returns the corresponding
      // enum key. Use this to return the requested component constructor.
      var id = Component.Type[type];
      var comConstr = Common.Drawing.Component.Library[id];

      if (!comConstr) {

        throw `There isn't a registered component with id "${id}".`;
      }

      return new comConstr(model);
    }
  }
}
