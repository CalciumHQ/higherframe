/// <reference path="../../../library/higherframe.ts"/>

module Higherframe.Modals.Project {

  export class New extends Higherframe.UI.Modal.Base implements Higherframe.UI.Modal.IModal {

    title = 'Create a new project';
    templateUrl = 'app/project/modals/new.html';

    // Form
    project: ng.IFormController;

    // Models
    name = '';


    /**
     * Event handlers
     */

    constructor(
      private Auth,
      private $mixpanel,
      private AlertManager: Higherframe.UI.AlertManager
    ) {

      super();
    }

    onCloseButtonClick() {

      this.close();
    }

    onSaveButtonClick() {

      this.project.$setSubmitted();
      if (this.project.$invalid) {

        return;
      }

      var injector = angular.injector(['ng']);
      injector.invoke(($http) => {

        $http({
          method: 'POST',
          url: '/api/projects',
          headers: {
            'Authorization': 'Bearer ' + this.Auth.getToken()
          },
          data: {
            name: this.name
          }
        })
        .then((response) => {

          // Add alert
          var alert = new Higherframe.UI.Alert();
          alert.text = `<span class="medium">${response.data.name}</span> was created`;
          alert.type = 'success';
          this.AlertManager.add(alert);

          // Track the event
          this.$mixpanel.track('Project created', {
            'Project ID': response.data._id,
            'Project Name': response.data.name
          });

          // Close the modal
          this.close();
        });
      });
    }
  }
}
