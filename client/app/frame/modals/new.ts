/// <reference path="../../../library/higherframe.ts"/>

module Higherframe.Modals.Frame {

  export class New extends Higherframe.UI.Modal.Base implements Higherframe.UI.Modal.IModal {

    title = 'New wireframe';
    templateUrl = '/app/frame/modals/new.html';

    // Form
    frame: ng.IFormController;

    // Models
    name = '';
    organisation: any;


    /**
     * Event handlers
     */

    onCloseButtonClick() {

      this.close();
    }

    onSaveButtonClick() {

      this.frame.$setSubmitted();
      if (this.frame.$invalid) {

        return;
      }

      var injector = angular.injector(['ng']);
      injector.invoke(($http) => {

        $http.post('/api/frames', {
          name: this.name,
          organisation: this.organisation._id
        });
      });

      this.close();
    }
  }
}
