declare module Common.Data {
    class Component implements IDrawingModel {
        _id: String;
        type: String;
        lastModifiedBy: String;
        properties: IComponentProperties;
        constructor(type: String, properties: IComponentProperties);
        /**
         * Create an instance from a POJO representation
         */
        static deserialize(data: any): Component;
    }
}
