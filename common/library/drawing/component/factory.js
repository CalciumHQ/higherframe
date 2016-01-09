var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        var Component;
        (function (Component) {
            /**
             * Factory for drawing components
             */
            var Factory = (function () {
                function Factory() {
                }
                /**
                 * Create a drawing component from a component data model.
                 */
                Factory.fromModel = function (model) {
                    // Get the component type
                    var type = Component.Type[model.type];
                    // Get the component definition and create an instance
                    var component = this.get(type, model);
                    return component;
                };
                /**
                 * Creates a new component for a given component type
                 */
                Factory.get = function (type, model) {
                    // Passing an enum value to the enum returns the corresponding
                    // enum key. Use this to return the requested component constructor.
                    var id = Component.Type[type];
                    var comConstr = Common.Drawing.Component.Library[id];
                    if (!comConstr) {
                        throw "There isn't a registered component with id \"" + id + "\".";
                    }
                    return new comConstr(model);
                };
                return Factory;
            })();
            Component.Factory = Factory;
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=factory.js.map