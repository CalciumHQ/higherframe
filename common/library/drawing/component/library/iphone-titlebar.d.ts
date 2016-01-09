/// <reference path="../component.d.ts" />
/// <reference path="../type.d.ts" />
declare module Common.Drawing.Component.Library {
    class IPhoneTitlebar extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: {
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                placeholder: string;
                description: string;
            }[];
        }[];
        preview: string;
        model: Common.Data.Component;
        constructor(model: Common.Data.IDrawingModel);
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.IIPhoneTitlebarProperties;
    }
}
