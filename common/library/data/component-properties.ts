
module Common.Data {

  export interface IComponentProperties {
    x: number,
    y: number,
    index: number
  }

  export interface ILabelProperties extends IComponentProperties {
    text: string,
    fontSize: number,
    fontWeight: number
  }

  export interface IRectangleProperties extends IComponentProperties {
    width: number,
    height: number,
    cornerRadius: number
  }

  export interface IArrowProperties extends IComponentProperties {
    start: Drawing.IPoint,
    end: Drawing.IPoint,
    direction: string,
    type: string
  }

  export interface IMobileDeviceProperties extends IComponentProperties {
    width: number,
    height: number,
    showBar: boolean
  }

  export interface IMobileTitlebarProperties extends IComponentProperties {
    width: number,
    title: string,
    leftIcon: string,
    rightIcon: string
  }

  export interface ITextInputProperties extends IComponentProperties {
    width: number,
    placeholder: String,
    value: String,
    fontSize: number,
    fontWeight: number
  }

  export interface ICheckboxProperties extends IComponentProperties {
    label: String,
    value: Boolean,
    fontSize: number,
    fontWeight: number
  }

  export interface IButtonProperties extends IComponentProperties {
    label: string,
    width: number,
    height: number,
    type: string,
    disabled: boolean,
    cornerRadius: number,
    fontSize: number,
    fontWeight: number
  }

  export interface IImageProperties extends IComponentProperties {
    media: Object,
    width: number,
    height: number,
    cornerRadius: number
  }

  export interface IIconProperties extends IComponentProperties {
    icon: string,
    width: number,
    height: number,
    fontSize: number
  }
}
