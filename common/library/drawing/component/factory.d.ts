declare module Common.Drawing.Component {
    /**
     * Factory for drawing components
     */
    class Factory {
        /**
         * Create a drawing component from a component data model.
         */
        static fromModel(model?: Common.Data.Component): Drawing.Component.IComponent;
        /**
         * Creates a new component for a given component type
         */
        private static get(type, model);
    }
}
