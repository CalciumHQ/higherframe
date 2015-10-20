/// <reference path="../higherframe.ts"/>

module Higherframe.UI {

  export interface ITheme {

    ComponentDefault: paper.Color;
    ComponentHover: paper.Color;
    ComponentActive: paper.Color;
    ComponentFocus: paper.Color;

    DragHandleDefault: paper.Color;
  }

  export class DefaultTheme implements ITheme {

    ComponentDefault = new paper.Color('#888');
    ComponentHover = new paper.Color('#7ae');
    ComponentActive = new paper.Color('#7ae');
    ComponentFocus = new paper.Color('#7ae');

    DragHandleDefault = new paper.Color('#98e001');
  };
}
