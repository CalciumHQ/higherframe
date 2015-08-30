/// <reference path="../../../library/higherframe.ts"/>

module Higherframe.Modals.Frame {

  export class Update extends Higherframe.UI.Modal.Base implements Higherframe.UI.Modal.IModal {

    title = 'Update wireframe';
    templateUrl = '/app/frame/modals/update.html';

    // Form
    form: ng.IFormController;

    // Options
    organisations: Array<any>;

    // Models
    name: string;
    organisation: string;

    constructor(private frame: any) {

      super();

      this.name = frame.name;
      this.organisation = frame.organisation._id;

      var injector = angular.injector(['ng']);
      injector.invoke(($http) => {

        $http
          .get(`/api/organisations`)
          .success((response) => {

            this.organisations = response;
            this.$scope.$apply();
          });
      });
    }


    /**
     * Event handlers
     */

    onCloseButtonClick() {

      this.close();
    }

    onDeleteButtonClick() {

      var injector = angular.injector(['ng']);
      injector.invoke(($http) => {

        $http.delete(`/api/frames/${this.frame._id}`);
      });

      this.close();
    }

    onSaveButtonClick() {

      this.form.$setSubmitted();
      if (this.form.$invalid) {

        return;
      }

      var injector = angular.injector(['ng']);
      injector.invoke(($http) => {

        $http.patch(`/api/frames/${this.frame._id}`, {
          name: this.name,
          organisation: this.organisation
        });
      });

      this.close();
    }
  }
}
