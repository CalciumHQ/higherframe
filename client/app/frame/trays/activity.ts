/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  export class ActivityTrayController {

    getCurrentUser: Function;
    activities: Array<Higherframe.Data.IActivity> = [];

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

      // Fetch the activities for this frame
      this.activities = Activity.query({ frameId: $stateParams.id });

      // Receive socket updates
  		this.socket.syncUpdates('activity', this.activities);

      // Provide the view with access to the current user
      this.getCurrentUser = Auth.getCurrentUser;
    }
  }

  export class ActivityTray implements Higherframe.UI.ITray {

    label = 'Activity';
    templateUrl = '/app/frame/trays/activity.html';
    controller = ActivityTrayController;

    constructor(private frame) {

    }
  }
}
