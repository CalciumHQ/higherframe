declare module Common.Drawing.Component.Library {
    class Arrow extends Drawing.Component.Base implements Drawing.Component.IComponent {
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
                options: {
                    label: string;
                    value: string;
                }[];
            }[];
        }[];
        thumbnail: string;
        snapPoints: {
            x: number;
            y: number;
        }[];
        model: Common.Data.Component;
        /**
         * Create a new Arrow component
         */
        constructor(model: Common.Data.IDrawingModel);
        /**
         * Perform any necessary transformation on the component when saving
         */
        serialize(): Common.Data.Component;
        /**
         * Redraw the component
         */
        update(): void;
        /**
         * Update model with the state of the view component
         */
        updateModel(): void;
        onMove(event: IComponentMoveEvent): void;
        /**
         * Calculate the snap points for the component
         */
        getSnapPoints(): Array<SnapPoint>;
        /**
         * Calculate the drag handles for the component
         */
        getDragHandles(color: paper.Color): Array<IDragHandle>;
    }
}
