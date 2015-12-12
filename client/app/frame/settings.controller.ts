'use strict';

module Higherframe.Controllers {

  export class FrameSettings {

    errors = {};
    organisations: Array<any>;

    // Models
    name: string;
    organisation: string;
    users: Array<any>;

    constructor(
      private frame: Higherframe.Data.IFrame,
      private $scope: ng.IScope,
      private $http: ng.IHttpService,
      private $state,
      private Frame,
      private AlertManager: Higherframe.UI.AlertManager
    ) {

      this.name = frame.name;
      this.organisation = frame.organisation._id;
      this.users = angular.copy(frame.users);

      $http
        .get(`/api/organisations`)
        .success((response: Array<any>) => {

          this.organisations = response;
        });
    }

    submit(form) {

      if (form.$valid) {

        this.$http.patch(`/api/frames/${this.frame._id}`, {
          name: this.name,
          organisation: this.organisation,
          users: this.users.map(user => user._id)
        })
        .then((response) => {

          this.$state.go('frame', { id: this.frame._id });
        });
      }
    }

    onUndoDeleteClick(alert: Higherframe.UI.Alert) {

      this.$http
        .patch(`/api/frames/${this.frame._id}?include_deleted`, { status: 'active' })
        .then((response) => {

          var index = this.AlertManager.alerts.indexOf(alert);

          if (index !== -1) {

            this.AlertManager.alerts.splice(index, 1);
          }
        });
    }

    onDeleteButtonClick() {

      this.$http
        .delete(`/api/frames/${this.frame._id}`)
        .then((response) => {

          var alert = new Higherframe.UI.Alert();
          alert.text = `<strong>${this.frame.name}</strong> has been deleted`;

          var undoAction = new Higherframe.UI.AlertAction();
          undoAction.label = 'Undo this';
          undoAction.action = () => { this.onUndoDeleteClick.call(this, alert); };
          alert.actions = [undoAction];

          this.AlertManager.push(alert);

          this.$state.go('frames');
        });
    }
  }
}

angular
  .module('siteApp')
  .controller('FrameSettingsCtrl', Higherframe.Controllers.FrameSettings);
