declare module Higherframe.Drawing {
    class Artboard extends paper.Group {
        name: string;
        width: number;
        height: number;
        left: number;
        top: number;
        hovered: boolean;
        active: boolean;
        focussed: boolean;
        constructor(model: Common.Data.IArtboard);
        update(canvas: any): void;
    }
}
