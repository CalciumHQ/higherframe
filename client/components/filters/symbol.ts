
module Higherframe.UI.Filters {

  export function Symbol() {

    // Detect the user's platform
    var isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;

    return function (input) {

      switch (input) {

        case 'ctrl':
          return '<span class="lucida">&#8984;</span>'

        case 'shift':
          return '<span class="lucida">&#8679;</span>';

        case 'alt':
          return '<span class="lucida">&#8997;</span>';

        default:
          return input;
      }
    };
  }
}

angular.module('siteApp').filter('symbol', Higherframe.UI.Filters.Symbol);
