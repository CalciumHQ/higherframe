
module Higherframe.UI.Filters {

  export class Unicode {

    constructor() {

      return (input: string): string => {

        return String.fromCharCode(parseInt(input, 16));
      }
    }
  }
}

angular
  .module('siteApp')
  .filter('unicode', Higherframe.UI.Filters.Unicode);
