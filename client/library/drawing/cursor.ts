/// <reference path="../higherframe.ts"/>

module Higherframe.Drawing {

  export class Cursor {};

  export class Cursors {

    static Default: Cursor = 'default';
    static Pointer: Cursor = 'pointer';
    static Move: Cursor = 'move';
    static Crosshair: Cursor = 'crosshair';
    static ResizeHorizontal: Cursor = 'ew-resize';
    static ResizeVertical: Cursor = 'ns-resize';
    static ResizeNESW: Cursor = 'nesw-resize';
    static ResizeNWSE: Cursor = 'nwse-resize';
  }
}
