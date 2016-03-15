
module Common.UI {

  export interface ITheme {

    Default: paper.Color;
    Primary: paper.Color;

    ComponentDefault: paper.Color;
    ComponentHover: paper.Color;
    ComponentActive: paper.Color;
    ComponentFocus: paper.Color;

    ComponentDefaultLight: paper.Color;
    ComponentHoverLight: paper.Color;
    ComponentActiveLight: paper.Color;
    ComponentFocusLight: paper.Color;

    ComponentDefaultDark: paper.Color;
    ComponentHoverDark: paper.Color;
    ComponentActiveDark: paper.Color;
    ComponentFocusDark: paper.Color;

    BorderDefault: paper.Color;
    BorderHover: paper.Color;
    BorderActive: paper.Color;
    BorderFocus: paper.Color;

    DragHandleDefault: paper.Color;

    BoundsDefault: paper.Color;

    GuideDefault: paper.Color;

    ShadingDefault: paper.Color;
  }

  export class DefaultTheme implements ITheme {

    Default = new paper.Color('#666');
    Primary = new paper.Color('#82cdec');

    ComponentDefault = this.Default;
    ComponentHover = this.Primary;
    ComponentActive = this.Default;
    ComponentFocus = this.Default;

    ComponentDefaultLight = new paper.Color('#aaa');
    ComponentHoverLight = new paper.Color('#82cdec');
    ComponentActiveLight = new paper.Color('#aaa');
    ComponentFocusLight = new paper.Color('#aaa');

    ComponentDefaultDark = new paper.Color('#222');
    ComponentHoverDark = new paper.Color('#82cdec');
    ComponentActiveDark = new paper.Color('#222');
    ComponentFocusDark = new paper.Color('#222');

    BorderDefault = new paper.Color('#ddd');
    BorderHover = new paper.Color('#82cdec');
    BorderActive = new paper.Color('#ddd');
    BorderFocus = new paper.Color('#ddd');

    DragHandleDefault = new paper.Color('#98e001');

    BoundsDefault = this.Primary;

    GuideDefault = new paper.Color('#ffc000');

    ShadingDefault = new paper.Color('#eee');
  };
}
