var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        var Component;
        (function (Component) {
            (function (Type) {
                Type[Type["Rectangle"] = 0] = "Rectangle";
                Type[Type["Arrow"] = 1] = "Arrow";
                Type[Type["IPhone"] = 2] = "IPhone";
                Type[Type["IPhoneTitlebar"] = 3] = "IPhoneTitlebar";
                Type[Type["MobileTitlebar"] = 4] = "MobileTitlebar";
                Type[Type["TextInput"] = 5] = "TextInput";
                Type[Type["SelectInput"] = 6] = "SelectInput";
                Type[Type["Checkbox"] = 7] = "Checkbox";
                Type[Type["Label"] = 8] = "Label";
                Type[Type["Button"] = 9] = "Button";
                Type[Type["Image"] = 10] = "Image";
                Type[Type["Icon"] = 11] = "Icon";
            })(Component.Type || (Component.Type = {}));
            var Type = Component.Type;
            ;
        })(Component = Drawing.Component || (Drawing.Component = {}));
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
;
//# sourceMappingURL=type.js.map