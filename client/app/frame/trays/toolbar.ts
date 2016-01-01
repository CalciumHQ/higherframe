/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  export class ToolbarController {

    quickAdd: string = '';
    components: Array<Higherframe.Drawing.Component.Library.ILibraryItem> = [];

    constructor(private $scope: ng.IScope, private ComponentLibrary: Higherframe.Drawing.Component.Library.IService) {

      this.components = this.ComponentLibrary.getItems();
      this.registerWatches();
    }

    private registerWatches() {

    }

    onQuickAddSelect($item: Higherframe.Drawing.Component.Library.ILibraryItem) {

      // Add the component
      this.$scope.$emit('toolbox:component:added', { id: $item.id });

      // Clear the quick add input
      this.quickAdd = '';
    }
  }
}

angular
  .module('siteApp')
  .controller('ToolbarCtrl', Higherframe.Controllers.Frame.ToolbarController);
