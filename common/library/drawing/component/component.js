var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        var Component;
        (function (Component) {
            ;
            /**
             * Provides boilerplate for creating components
             */
            var Base = (function (_super) {
                __extends(Base, _super);
                function Base(model) {
                    _super.call(this);
                    // Drawing properties
                    this._hovered = false;
                    this._active = false;
                    this._focussed = false;
                    this._parts = {};
                    this._properties = [];
                    // Bind to the model
                    this.model = model;
                }
                Object.defineProperty(Base.prototype, "hovered", {
                    get: function () { return this._hovered; },
                    set: function (value) { this._hovered = value; this.update(); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Base.prototype, "active", {
                    get: function () { return this._active; },
                    set: function (value) { this._active = value; this.update(); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Base.prototype, "focussed", {
                    get: function () { return this._focussed; },
                    set: function (value) { this._focussed = value; this.update(); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Base.prototype, "parts", {
                    get: function () { return this._parts; },
                    set: function (value) { this._parts = value; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Base.prototype, "collaborator", {
                    get: function () { return this._collaborator; },
                    set: function (value) { this._collaborator = value; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Base.prototype, "properties", {
                    get: function () { return this._properties; },
                    set: function (value) { this._properties = value; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Base.prototype, "boundingBox", {
                    get: function () { return this._boundingBox; },
                    set: function (value) { this._boundingBox = value; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Base.prototype, "dragHandles", {
                    get: function () { return this._dragHandles; },
                    set: function (value) { this._dragHandles = value; },
                    enumerable: true,
                    configurable: true
                });
                Base.prototype.serialize = function () {
                    return this.model;
                };
                Base.prototype.setProperty = function (name, value) {
                    this.model.properties[name] = value;
                };
                // Should be implemented by derived class
                Base.prototype.update = function () { };
                ;
                Base.prototype.updateModel = function () { };
                ;
                Base.prototype.getSnapPoints = function () { return []; };
                Base.prototype.getDragHandles = function (color) { return []; };
                Base.prototype.getTransformHandles = function (color) { return []; };
                return Base;
            })(paper.Group);
            Component.Base = Base;
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
;
//# sourceMappingURL=component.js.map