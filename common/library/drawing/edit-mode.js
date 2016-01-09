var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        (function (EditMode) {
            EditMode[EditMode["Draw"] = 0] = "Draw";
            EditMode[EditMode["Artboards"] = 1] = "Artboards";
            EditMode[EditMode["Annotate"] = 2] = "Annotate";
        })(Drawing.EditMode || (Drawing.EditMode = {}));
        var EditMode = Drawing.EditMode;
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
//# sourceMappingURL=edit-mode.js.map