var Common;
(function (Common) {
    var UI;
    (function (UI) {
        var DefaultTheme = (function () {
            function DefaultTheme() {
                this.ComponentDefault = new paper.Color('#888');
                this.ComponentHover = new paper.Color('#444');
                this.ComponentActive = new paper.Color('#a4d64e');
                this.ComponentFocus = new paper.Color('#a4d64e');
                this.ComponentDefaultLight = new paper.Color('#aaa');
                this.ComponentHoverLight = new paper.Color('#444');
                this.ComponentActiveLight = new paper.Color('#a4d64e');
                this.ComponentFocusLight = new paper.Color('#a4d64e');
                this.ComponentDefaultDark = new paper.Color('#222');
                this.ComponentHoverDark = new paper.Color('#000');
                this.ComponentActiveDark = new paper.Color('#a4d64e');
                this.ComponentFocusDark = new paper.Color('#a4d64e');
                this.BorderDefault = new paper.Color('#ddd');
                this.BorderHover = new paper.Color('#666');
                this.BorderActive = new paper.Color('#a4d64e');
                this.BorderFocus = new paper.Color('#a4d64e');
                this.DragHandleDefault = new paper.Color('#98e001');
                this.BoundsDefault = new paper.Color('#a4d64e');
                this.GuideDefault = new paper.Color('#ffc000');
                this.ShadingDefault = new paper.Color('#eee');
            }
            return DefaultTheme;
        })();
        UI.DefaultTheme = DefaultTheme;
        ;
    })(UI = Common.UI || (Common.UI = {}));
})(Common || (Common = {}));
//# sourceMappingURL=theme.js.map