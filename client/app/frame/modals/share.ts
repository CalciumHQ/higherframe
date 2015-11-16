/// <reference path="../../../library/higherframe.ts"/>

module Higherframe.Modals.Frame {

  export class Share extends Higherframe.UI.Modal.Base implements Higherframe.UI.Modal.IModal {

    title = 'Share wireframe';
    templateUrl = '/app/frame/modals/share.html';
    frame: any;

    // Form
    form: ng.IFormController;

    // Options
    organisations: Array<any>;

    // Models
    users: Array<any> = [];

    constructor(frame: any, private Auth: any, private $mixpanel: any) {

      super();

      this.frame = frame;

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

    onCancelButtonClick() {

      this.close();
    }

    onDeleteButtonClick() {

      var injector = angular.injector(['ng']);
      injector.invoke(($http) => {

        $http.delete(`/api/frames/${this.frame._id}`);
      });

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
          url: `/api/frames/${this.frame._id}/users`,
          headers: {
            'Authorization': 'Bearer ' + this.Auth.getToken()
          },
          data: this.users.map(user => user._id)
        })
        .then((response) => {

          this.$mixpanel.track('Wireframe created', {
            'Frame ID': this.frame._id,
            'Frame Name': this.frame.name
          });
        });
      });

      this.close();
    }
  }
}
