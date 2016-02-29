/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  export class ToolboxTrayController {

    components: Array<Higherframe.Drawing.Component.Library.ILibraryItem> = [];

    constructor(private $scope: ng.IScope, private ComponentLibrary: Higherframe.Drawing.Component.Library.IService) {

      this.components = this.ComponentLibrary.getItems();
    }
  }
}

angular
  .module('siteApp')
  .controller('ToolboxCtrl', Higherframe.Controllers.Frame.ToolboxTrayController);
