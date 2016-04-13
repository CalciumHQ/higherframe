
module Common.Data {

  export class Component {

    _id: String;
    type: String;
    lastModifiedBy: String;
    properties: ComponentProperties;

    constructor(type: String, properties: ComponentProperties) {

      this.type = type;
      this.properties = properties;
    }

    public save(frameId: string) {

      let injector = angular.injector(['ng']);
      injector.invoke(['$http', ($http) => {

        let serialized = this.serialize();

        $http
          .post('/api/frames/' + frameId + '/components', serialized)
          .success((data: any) => {

            this._id = data._id;
            this.properties.commit();
          });
      }]);
    }

    public update() {

      let injector = angular.injector(['ng']);
      injector.invoke(['$http', ($http) => {

        let serialized = this.serialize();
        $http
          .patch('/api/components/' + this._id, serialized)
          .success(() => {

            this.properties.commit();
          });
      }]);
    }

    private serialize() {

      return {
        _id: this._id,
        type: this.type,
        lastModifiedBy: this.lastModifiedBy,
        properties: this.properties.getLocal()
      }
    }


    /**
     * Create an instance from a POJO representation
     */

    static deserialize(data: any): Component {

      let properties = new ComponentProperties(data.properties);
      let component = new Component(data.type, properties);

      if (data._id) {

        component._id = data._id;
      }

      if (data.lastModifiedBy) {

        component.lastModifiedBy = data.lastModifiedBy;
      }

      return component;
    }
  }
}
