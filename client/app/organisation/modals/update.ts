/// <reference path="../../../library/higherframe.ts"/>

module Higherframe.Modals.Organisation {

  export class Update extends Higherframe.UI.Modal.Base implements Higherframe.UI.Modal.IModal {

    title = 'Update organisation';
    templateUrl = '/app/organisation/modals/update.html';

    // Form
    form: ng.IFormController;

    // Options
    organisations: Array<any>;

    // Models
    name: string;

    constructor(private organisation: any) {

      super();

      this.name = organisation.name;
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

        $http.delete(`/api/organisations/${this.organisation._id}`);
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

        $http.patch(`/api/organisations/${this.organisation._id}`, {
          name: this.name
        });
      });

      this.close();
    }
  }
}
