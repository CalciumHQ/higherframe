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

    constructor(frame: any) {

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

        $http.post(`/api/frames/${this.frame._id}/users`, this.users.map(user => user._id));
      });

      this.close();
    }
  }
}
