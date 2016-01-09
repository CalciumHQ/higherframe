declare module Common.Drawing.Component.Library {
    class Icon extends Drawing.Component.Base implements Drawing.Component.IComponent {
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
                ui: string;
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: NumberConstructor;
            }[];
        })[];
        model: Common.Data.Component;
        icon: paper.PointText;
        /**
         * Create a new Icon component
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
         * Cast the model properties into the correct type
         */
        getProperties(): Common.Data.IIconProperties;
    }
}
