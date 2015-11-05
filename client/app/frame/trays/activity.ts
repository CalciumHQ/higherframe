/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  export class ActivityTrayController {

    frameId: string;
    getCurrentUser: Function;
    activities: Array<Higherframe.Data.IActivity> = [];
    newMessage: string = '';

    constructor(
      private $scope: ng.IScope,
      private $stateParams,
      private Activity: Higherframe.Data.IActivityResource,
      private Auth,
      private socket
    ) {

      if (!$stateParams.id) {

        throw 'Activity tray may only be used on a page with a id param representing the frame id';
      }

      this.frameId = $stateParams.id;

      // Fetch the activities for this frame
      this.activities = Activity.query({ frameId: this.frameId });

      // Provide the view with access to the current user
      this.getCurrentUser = Auth.getCurrentUser;
    }

    onActivityFormSubmit() {

      if (!this.newMessage) {

        return;
      }

      var activity = new this.Activity({
        frame:    this.frameId,
        user:     this.Auth.getCurrentUser()._id,
        message:  this.newMessage,
        type:     'chat'
      });

      activity.$save();

      this.newMessage = '';
    }
  }
}

angular
  .module('siteApp')
  .controller('ActivityCtrl', Higherframe.Controllers.Frame.ActivityTrayController);
