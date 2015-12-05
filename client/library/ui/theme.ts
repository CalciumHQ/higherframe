/// <reference path="../higherframe.ts"/>

module Higherframe.UI {

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

    ShadingDefault: paper.Color;
  }

  export class DefaultTheme implements ITheme {

    ComponentDefault = new paper.Color('#888');
    ComponentHover = new paper.Color('#7ae');
    ComponentActive = new paper.Color('#7ae');
    ComponentFocus = new paper.Color('#7ae');

    ComponentDefaultLight = new paper.Color('#aaa');
    ComponentHoverLight = new paper.Color('#7ae');
    ComponentActiveLight = new paper.Color('#7ae');
    ComponentFocusLight = new paper.Color('#7ae');

    ComponentDefaultDark = new paper.Color('#000');
    ComponentHoverDark = new paper.Color('#7ae');
    ComponentActiveDark = new paper.Color('#7ae');
    ComponentFocusDark = new paper.Color('#7ae');

    BorderDefault = new paper.Color('#ddd');
    BorderHover = new paper.Color('#7ae');
    BorderActive = new paper.Color('#7ae');
    BorderFocus = new paper.Color('#7ae');

    DragHandleDefault = new paper.Color('#98e001');

    ShadingDefault = new paper.Color('#eee');
  };
}
