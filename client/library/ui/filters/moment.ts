
/// <reference path="../../../typings/moment/moment.d.ts"/>


/**
 * Configure moment
 */

moment.locale('en', {
  calendar : {
    lastDay : '[Yesterday] LT',
    sameDay : '[Today] LT',
    nextDay : '[Tomorrow] LT',
    lastWeek : '[last] dddd LT',
    nextWeek : 'dddd LT',
    sameElse : 'L'
  }
});

module Higherframe.UI {

  export module Filters {

    export class MomentPattern {

      constructor() {

        return function(input, pattern) {

          var m = moment(input);
          return m.format(pattern);
        };
      }
    }

    export class MomentCalendar {

      constructor() {

        return function(input) {

          var m = moment(input);
          return m.calendar();
        };
      }
    }

    export class MomentDiff {

      constructor() {

        return function(input, compare, unit) {

          var m = moment(input);
          var n = moment(compare);
          return m.diff(n, unit);
        };
      }
    }
  }
}

angular
  .module('siteApp')
  .filter('momentPattern', Higherframe.UI.Filters.MomentPattern)
  .filter('momentCalendar', Higherframe.UI.Filters.MomentCalendar)
  .filter('momentDiff', Higherframe.UI.Filters.MomentDiff);
