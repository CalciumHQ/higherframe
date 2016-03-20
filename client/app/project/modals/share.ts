/// <reference path="../../../library/higherframe.ts"/>

module Higherframe.Modals.Project {

  export class Share extends Higherframe.UI.Modal.Base implements Higherframe.UI.Modal.IModal {

    title = 'Share wireframe';
    templateUrl = '/app/project/modals/share.html';

    // Form
    form: ng.IFormController;

    // Options
    organisations: Array<any>;

    // Models
    users: Array<any> = [];

    constructor(private project: any, private Auth: any, private $mixpanel: any) {

      super();
    }


    /**
     * Event handlers
     */

    onCancelButtonClick() {

      this.close();
    }

    onShareButtonClick() {

      this.form.$setSubmitted();
      if (this.form.$invalid) {

        return;
      }

      var injector = angular.injector(['ng']);
      injector.invoke(($http) => {

        $http({
          method: 'POST',
          url: `/api/projects/${this.project._id}/users`,
          headers: {
            'Authorization': 'Bearer ' + this.Auth.getToken()
          },
          data: this.users.map(user => user._id)
        })
        .then((response) => {

          this.$mixpanel.track('Wireframe created', {
            'Project ID': this.project._id,
            'Project Name': this.project.name
          });
        });
      });

      this.close();
    }
  }
}
