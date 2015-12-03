
/// <reference path="../../../typings/moment/moment.d.ts"/>


/**
 * Configure moment
 */

module Higherframe.UI.Filters {

  export class ActivityShowHeader {

    constructor() {

      return function(input:Higherframe.Data.IActivity, previous:Higherframe.Data.IActivity):boolean {

        // Show the header if there is no previous activity
        if (!previous) {

          return true;
        }

        var m = moment(input.created_at);
        var p = moment(previous.created_at);
        return m.diff(p, 'minutes') > 5;
      };
    }
  }

  export class ActivityCollapseItem {

    constructor($filter: ng.IFilterService) {

      return function(input:Higherframe.Data.IActivity, previous:Higherframe.Data.IActivity):boolean {

        // Never collapse the first item in a group
        var isFirstInGroup = $filter('activityShowHeader')(input, previous);
        if (isFirstInGroup) {

          return false;
        }

        // Determine if this message is in a sequence of messages
        var isSequence = (input.type == 'chat' || input.type == 'ping')
          && (previous.type == 'chat' || previous.type == 'ping')
          && (input.user._id == previous.user._id);

        return isSequence;
      }
    }
  }
}

angular
  .module('siteApp')
  .filter('activityShowHeader', Higherframe.UI.Filters.ActivityShowHeader)
  .filter('activityCollapseItem', Higherframe.UI.Filters.ActivityCollapseItem);
