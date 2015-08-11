/// <reference path="../higherframe.ts"/>

module Higherframe.Data {

  export interface IComponentProperties {
    x: number,
    y: number,
    index: number
  }

  export interface IRectangleProperties extends IComponentProperties {
    width: number,
    height: number,
    cornerRadius: number
  }

  export interface IArrowProperties extends IComponentProperties {
    start: Drawing.IPoint,
    end: Drawing.IPoint
  }

  export interface IIPhoneProperties extends IComponentProperties {

  }

  export interface IIPhoneTitlebarProperties extends IComponentProperties {
    time: String
  }
}
