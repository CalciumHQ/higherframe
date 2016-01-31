
module Common.UI {

  export interface ITheme {

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

    ComponentDefault = new paper.Color('#888');
    ComponentHover = new paper.Color('#444');
    ComponentActive = new paper.Color('#0881a8');
    ComponentFocus = new paper.Color('#82cdec');

    ComponentDefaultLight = new paper.Color('#aaa');
    ComponentHoverLight = new paper.Color('#444');
    ComponentActiveLight = new paper.Color('#0881a8');
    ComponentFocusLight = new paper.Color('#82cdec');

    ComponentDefaultDark = new paper.Color('#222');
    ComponentHoverDark = new paper.Color('#000');
    ComponentActiveDark = new paper.Color('#0881a8');
    ComponentFocusDark = new paper.Color('#82cdec');

    BorderDefault = new paper.Color('#ddd');
    BorderHover = new paper.Color('#666');
    BorderActive = new paper.Color('#0881a8');
    BorderFocus = new paper.Color('#82cdec');

    DragHandleDefault = new paper.Color('#98e001');

    BoundsDefault = new paper.Color('#42b2d6');

    GuideDefault = new paper.Color('#ffc000');

    ShadingDefault = new paper.Color('#eee');
  };
}
