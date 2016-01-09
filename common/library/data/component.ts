
module Common.Data {

  export class Component implements IDrawingModel {

    _id: String;
    type: String;
    lastModifiedBy: String;
    properties: IComponentProperties;


    constructor(type: String, properties: IComponentProperties) {

      this.type = type;
      this.properties = properties;
    }


    /**
     * Create an instance from a POJO representation
     */

    static deserialize(data: any): Component {

      return new Component(data.type, data.properties);
    }
  }
}
