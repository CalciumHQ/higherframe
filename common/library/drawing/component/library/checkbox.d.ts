declare module Common.Drawing.Component.Library {
    class Checkbox extends Drawing.Component.Base implements Drawing.Component.IComponent {
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
            controls: {
                model: string;
                type: BooleanConstructor;
                ui: string;
                options: {
                    label: string;
                    value: boolean;
                }[];
                description: string;
            }[];
        } | {
            label: string;
            controls: {
                model: string;
                type: NumberConstructor;
                description: string;
            }[];
        })[];
        model: Common.Data.Component;
        /**
         * Create a new Select component
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
        getProperties(): Common.Data.ICheckboxProperties;
    }
}
