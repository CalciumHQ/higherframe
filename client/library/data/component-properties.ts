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
    end: Drawing.IPoint,
    direction: string
  }

  export interface IIPhoneProperties extends IComponentProperties {

  }

  export interface IIPhoneTitlebarProperties extends IComponentProperties {
    time: String
  }

  export interface ITextInputProperties extends IComponentProperties {
    width: number,
    placeholder: String,
    value: String,
    fontSize: number
  }

  export interface ICheckboxProperties extends IComponentProperties {
    label: String,
    value: Boolean,
    fontSize: number
  }
}
