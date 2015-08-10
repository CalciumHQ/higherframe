/// <reference path="../higherframe.ts"/>

module Higherframe.Data {

  export class Component implements IDrawingModel {

    _id: String;
    type: String;
    properties: IComponentProperties


    /**
     * Create an instance from a POJO representation
     */

    static deserialize(data: Object): Component {

      return new Component();
    }
  }
}
