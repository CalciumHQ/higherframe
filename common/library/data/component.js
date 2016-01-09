var Common;
(function (Common) {
    var Data;
    (function (Data) {
        var Component = (function () {
            function Component(type, properties) {
                this.type = type;
                this.properties = properties;
            }
            /**
             * Create an instance from a POJO representation
             */
            Component.deserialize = function (data) {
                return new Component(data.type, data.properties);
            };
            return Component;
        })();
        Data.Component = Component;
    })(Data = Common.Data || (Common.Data = {}));
})(Common || (Common = {}));
//# sourceMappingURL=component.js.map