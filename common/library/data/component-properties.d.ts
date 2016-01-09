declare module Common.Data {
    interface IComponentProperties {
        x: number;
        y: number;
        index: number;
    }
    interface ILabelProperties extends IComponentProperties {
        text: string;
        fontSize: number;
        fontWeight: number;
    }
    interface IRectangleProperties extends IComponentProperties {
        width: number;
        height: number;
        cornerRadius: number;
    }
    interface IArrowProperties extends IComponentProperties {
        start: Drawing.IPoint;
        end: Drawing.IPoint;
        direction: string;
        type: string;
    }
    interface IIPhoneProperties extends IComponentProperties {
    }
    interface IIPhoneTitlebarProperties extends IComponentProperties {
        time: String;
    }
    interface IMobileTitlebarProperties extends IComponentProperties {
        width: number;
        height: number;
        title: string;
        leftIcon: string;
        rightIcon: string;
    }
    interface ITextInputProperties extends IComponentProperties {
        width: number;
        placeholder: String;
        value: String;
        fontSize: number;
        fontWeight: number;
    }
    interface ICheckboxProperties extends IComponentProperties {
        label: String;
        value: Boolean;
        fontSize: number;
        fontWeight: number;
    }
    interface IButtonProperties extends IComponentProperties {
        label: string;
        width: number;
        height: number;
        type: string;
        disabled: boolean;
        cornerRadius: number;
        fontSize: number;
        fontWeight: number;
    }
    interface IImageProperties extends IComponentProperties {
        media: Object;
        width: number;
        height: number;
        cornerRadius: number;
    }
    interface IIconProperties extends IComponentProperties {
        icon: string;
        width: number;
        height: number;
        fontSize: number;
    }
}
