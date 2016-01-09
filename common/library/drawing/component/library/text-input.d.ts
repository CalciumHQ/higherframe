declare module Common.Drawing.Component.Library {
    class TextInput extends Drawing.Component.Base implements Drawing.Component.IComponent {
        id: Type;
        static title: string;
        static preview: string;
        static category: string;
        tags: string[];
        properties: ({
            label: string;
            controls: {
                model: string;
                type: StringConstructor;
                description: string;
            }[];
        } | {
            label: string;
            controls: ({
                model: string;
                type: NumberConstructor;
                placeholder: string;
                unit: string;
                description: string;
            } | {
                model: string;
                type: NumberConstructor;
                ui: string;
                options: {
                    label: string;
                    value: number;
                }[];
                placeholder: string;
                description: string;
            })[];
        })[];
        model: Common.Data.Component;
        /**
         * Create a new Text Input component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        /**
         * Calculate the transform handles for the component
         */
        getTransformHandles(color: paper.Color): Array<IDragHandle>;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.ITextInputProperties;
        /**
         * Calculate the height of the component
         */
        getHeight(): number;
    }
}
