declare module Common.Drawing.Component {
    interface IComponentMoveEvent {
        position: paper.Point;
        delta: paper.Point;
    }
    /**
     * Defines the interface for a component which can be drawn on a
     * paperjs canvas
     *
     * @extends Paper.Group
     */
    interface IComponent extends paper.Group {
        id: Component.Type;
        title: String;
        preview?: String;
        category?: String;
        tags: Array<String>;
        thumbnail: String;
        model: Common.Data.IDrawingModel;
        deserialize?: () => void;
        serialize: () => Common.Data.IDrawingModel;
        update: () => void;
        updateModel: () => void;
        getSnapPoints: () => Array<SnapPoint>;
        getTransformHandles: (color: paper.Color) => Array<IDragHandle>;
        getDragHandles: (color: paper.Color) => Array<IDragHandle>;
        setProperty: (string, any) => void;
        onMove?: (IComponentMoveEvent) => void;
        hovered: Boolean;
        active: Boolean;
        focussed: Boolean;
        parts: any;
        collaborator: any;
        properties: Array<Object>;
        dragHandles: paper.Group;
        position: paper.Point;
        remove(): boolean;
    }
    /**
     * Provides boilerplate for creating components
     */
    class Base extends paper.Group implements IComponent {
        id: Component.Type;
        title: String;
        tags: Array<String>;
        thumbnail: String;
        resizable: Boolean;
        showBounds: Boolean;
        model: Common.Data.IDrawingModel;
        _hovered: Boolean;
        hovered: Boolean;
        _active: Boolean;
        active: Boolean;
        _focussed: Boolean;
        focussed: Boolean;
        _parts: {};
        parts: {};
        _collaborator: Common.Data.IUser;
        collaborator: Common.Data.IUser;
        _properties: Array<Object>;
        properties: Array<Object>;
        _boundingBox: paper.Group;
        boundingBox: paper.Group;
        _dragHandles: paper.Group;
        dragHandles: paper.Group;
        constructor(model: Common.Data.IDrawingModel);
        serialize(): Common.Data.IDrawingModel;
        setProperty(name: string, value: any): void;
        update(): void;
        updateModel(): void;
        getSnapPoints(): any[];
        getDragHandles(color: paper.Color): any[];
        getTransformHandles(color: paper.Color): any[];
    }
}
