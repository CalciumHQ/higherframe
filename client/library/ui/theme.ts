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

    BoundsDefault: paper.Color;

    GuideDefault: paper.Color;

    ShadingDefault: paper.Color;
  }

  export class DefaultTheme implements ITheme {

    ComponentDefault = new paper.Color('#888');
    ComponentHover = new paper.Color('#a4d64e');
    ComponentActive = new paper.Color('#a4d64e');
    ComponentFocus = new paper.Color('#a4d64e');

    ComponentDefaultLight = new paper.Color('#aaa');
    ComponentHoverLight = new paper.Color('#a4d64e');
    ComponentActiveLight = new paper.Color('#a4d64e');
    ComponentFocusLight = new paper.Color('#a4d64e');

    ComponentDefaultDark = new paper.Color('#000');
    ComponentHoverDark = new paper.Color('#a4d64e');
    ComponentActiveDark = new paper.Color('#a4d64e');
    ComponentFocusDark = new paper.Color('#a4d64e');

    BorderDefault = new paper.Color('#ddd');
    BorderHover = new paper.Color('#a4d64e');
    BorderActive = new paper.Color('#a4d64e');
    BorderFocus = new paper.Color('#a4d64e');

    DragHandleDefault = new paper.Color('#98e001');

    BoundsDefault = new paper.Color('#a4d64e');

    GuideDefault = new paper.Color('#ffc000');

    ShadingDefault = new paper.Color('#eee');
  };
}
