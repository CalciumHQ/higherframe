
module Common.Data {

  export class ComponentProperties {

    protected local: any = {};
    protected remote: any = {};

    public get x(): number { return this.local.x; }
    public set x(val) { this.local.x = val; }

    public get y(): number { return this.local.y; }
    public set y(val) { this.local.y = val; }

    public get width(): number { return this.local.width; }
    public set width(val) { this.local.width = val; }

    public get height(): number { return this.local.height; }
    public set height(val) { this.local.height = val; }

    public get index(): number { return this.local.index; }
    public set index(val) { this.local.index = val; }

    public get opacity(): number { return this.local.opacity; }
    public set opacity(val) { this.local.opacity = val; }

    constructor(data) {

      angular.forEach(data, (value, key) => {

        if (this.hasProperty(key)) {

          this.local[key] = value;
        }
      });
    }

    protected hasProperty(name) {

      let descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), name);

      if (!descriptor) {

        return false;
      }

      return !!descriptor.get;
    }

    public getLocal() {

      return this.local;
    }

    public getRemote() {

      return this.remote;
    }

    public commit() {

      angular.extend(this.remote, this.local);
    }

    public reset() {

      angular.extend(this.local, this.remote);
    }
  }

  export class LabelProperties extends ComponentProperties {

    public get text(): string { return this.local.text; }
    public set text(val) { this.local.text = val; }

    public get fontFamily(): string { return this.local.fontFamily; }
    public set fontFamily(val) { this.local.fontFamily = val; }

    public get fontWeight(): number { return this.local.fontWeight; }
    public set fontWeight(val) { this.local.fontWeight = val; }

    public get fontSize(): number { return this.local.fontSize; }
    public set fontSize(val) { this.local.fontSize = val; }

    public get lineHeight(): number { return this.local.lineHeight; }
    public set lineHeight(val) { this.local.lineHeight = val; }

    public get justification(): string { return this.local.justification; }
    public set justification(val) { this.local.justification = val; }

    public get area(): boolean { return this.local.area; }
    public set area(val) { this.local.area = val; }

    public get fillColor(): string { return this.local.fillColor; }
    public set fillColor(val) { this.local.fillColor = val; }

  }

  export class RectangleProperties extends ComponentProperties {

    public get cornerRadius(): number { return this.local.cornerRadius; }
    public set cornerRadius(val) { this.local.cornerRadius = val; }

    public get fillColor(): string { return this.local.fillColor; }
    public set fillColor(val) { this.local.fillColor = val; }

    public get borderColor(): string { return this.local.borderColor; }
    public set borderColor(val) { this.local.borderColor = val; }

    public get borderWidth(): number { return this.local.borderWidth; }
    public set borderWidth(val) { this.local.borderWidth = val; }

  }

  export class EllipseProperties extends ComponentProperties {

    public get fillColor(): string { return this.local.fillColor; }
    public set fillColor(val) { this.local.fillColor = val; }

    public get borderColor(): string { return this.local.borderColor; }
    public set borderColor(val) { this.local.borderColor = val; }

    public get borderWidth(): number { return this.local.borderWidth; }
    public set borderWidth(val) { this.local.borderWidth = val; }
  }

  export class ArrowProperties extends ComponentProperties {

    public get start(): Drawing.IPoint { return this.local.start; }
    public set start(val) { this.local.start = val; }

    public get end(): Drawing.IPoint { return this.local.end; }
    public set end(val) { this.local.end = val; }

    public get direction(): string { return this.local.direction; }
    public set direction(val) { this.local.direction = val; }

    public get type(): string { return this.local.type; }
    public set type(val) { this.local.type = val; }

    public get borderColor(): string { return this.local.borderColor; }
    public set borderColor(val) { this.local.borderColor = val; }

    public get borderWidth(): number { return this.local.borderWidth; }
    public set borderWidth(val) { this.local.borderWidth = val; }

  }

  export class MobileDeviceProperties extends ComponentProperties {

    public get showBar(): boolean { return this.local.showBar; }
    public set showBar(val) { this.local.showBar = val; }

  }

  export class MobileTitlebarProperties extends ComponentProperties {

    public get title(): string { return this.local.title; }
    public set title(val) { this.local.title = val; }

    public get leftIcon(): string { return this.local.leftIcon; }
    public set leftIcon(val) { this.local.leftIcon = val; }

    public get rightIcon(): string { return this.local.rightIcon; }
    public set rightIcon(val) { this.local.rightIcon = val; }

  }

  export class TextInputProperties extends ComponentProperties {

    public get placeholder(): String { return this.local.placeholder; }
    public set placeholder(val) { this.local.placeholder = val; }

    public get value(): String { return this.local.value; }
    public set value(val) { this.local.value = val; }

    public get fontSize(): number { return this.local.fontSize; }
    public set fontSize(val) { this.local.fontSize = val; }

    public get fontWeight(): number { return this.local.fontWeight; }
    public set fontWeight(val) { this.local.fontWeight = val; }

  }

  export class SelectInputProperties extends ComponentProperties {

    public get placeholder(): String { return this.local.placeholder; }
    public set placeholder(val) { this.local.placeholder = val; }

    public get value(): String { return this.local.value; }
    public set value(val) { this.local.value = val; }

    public get fontSize(): number { return this.local.fontSize; }
    public set fontSize(val) { this.local.fontSize = val; }

    public get fontWeight(): number { return this.local.fontWeight; }
    public set fontWeight(val) { this.local.fontWeight = val; }

  }

  export class CheckboxProperties extends ComponentProperties {

    public get label(): String { return this.local.label; }
    public set label(val) { this.local.label = val; }

    public get value(): Boolean { return this.local.value; }
    public set value(val) { this.local.value = val; }

    public get fontSize(): number { return this.local.fontSize; }
    public set fontSize(val) { this.local.fontSize = val; }

    public get fontWeight(): number { return this.local.fontWeight; }
    public set fontWeight(val) { this.local.fontWeight = val; }

  }

  export class ButtonProperties extends ComponentProperties {

    public get label(): string { return this.local.label; }
    public set label(val) { this.local.label = val; }

    public get disabled(): boolean { return this.local.disabled; }
    public set disabled(val) { this.local.disabled = val; }

    public get fontFamily(): string { return this.local.fontFamily; }
    public set fontFamily(val) { this.local.fontFamily = val; }

    public get fontWeight(): number { return this.local.fontWeight; }
    public set fontWeight(val) { this.local.fontWeight = val; }

    public get fontSize(): number { return this.local.fontSize; }
    public set fontSize(val) { this.local.fontSize = val; }

    public get cornerRadius(): number { return this.local.cornerRadius; }
    public set cornerRadius(val) { this.local.cornerRadius = val; }

    public get fillColor(): string { return this.local.fillColor; }
    public set fillColor(val) { this.local.fillColor = val; }

    public get borderColor(): string { return this.local.borderColor; }
    public set borderColor(val) { this.local.borderColor = val; }

    public get borderWidth(): number { return this.local.borderWidth; }
    public set borderWidth(val) { this.local.borderWidth = val; }

  }

  export class ImageProperties extends ComponentProperties {

    public get media(): Object { return this.local.media; }
    public set media(val) { this.local.media = val; }

    public get cornerRadius(): number { return this.local.cornerRadius; }
    public set cornerRadius(val) { this.local.cornerRadius = val; }

  }

  export class IconProperties extends ComponentProperties {

    public get icon(): string { return this.local.icon; }
    public set icon(val) { this.local.icon = val; }

    public get fontSize(): number { return this.local.fontSize; }
    public set fontSize(val) { this.local.fontSize = val; }

  }

  export class BrowserProperties extends ComponentProperties {

    public get address(): string { return this.local.address; }
    public set address(val) { this.local.address = val; }

  }
}
