/// <reference path="../../../library/higherframe.ts"/>

module Higherframe.Modals.Frame {

  export class New extends Higherframe.UI.Modal.Base implements Higherframe.UI.Modal.IModal {

    title = 'New wireframe';
    templateUrl = '/app/frame/modals/new.html';

    // Form
    frame: ng.IFormController;

    // Models
    name = '';
    project: Higherframe.Data.IProject;


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

      this.frame.$setSubmitted();
      if (this.frame.$invalid) {

        return;
      }

      var injector = angular.injector(['ng']);
      injector.invoke(($http) => {

        $http({
          method: 'POST',
          url: '/api/frames',
          headers: {
            'Authorization': 'Bearer ' + this.Auth.getToken()
          },
          data: {
            name: this.name,
            project: this.project._id
          }
        })
        .then((response) => {

          // Add alert
          var alert = new Higherframe.UI.Alert();
          alert.text = `<strong>${response.data.name}</strong> was created`;
          alert.type = 'success';
          this.AlertManager.add(alert);

          // Track the event
          this.$mixpanel.track('Wireframe created', {
            'Frame ID': response.data._id,
            'Frame Name': response.data.name
          });

          // Close the modal
          this.close();
        });
      });
    }
  }
}
