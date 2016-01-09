declare module Common.Drawing.Component.Library {
    class Image extends Drawing.Component.Base implements Drawing.Component.IComponent {
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
                ui: string;
                description: string;
            }[];
        }[];
        model: Common.Data.Component;
        /**
         * Create a new Button component
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
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Calculate the transform handles for the component
         */
        getTransformHandles(color: paper.Color): Array<IDragHandle>;
        /**
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.IImageProperties;
    }
}
