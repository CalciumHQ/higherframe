/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  interface ToolboxItem {
    tool?: any,
    title: string,
    icon: string,
    active?: boolean
  }

  export class ToolboxTrayController {

    private items: Array<ToolboxItem> = [];

    constructor(private $scope: ng.IScope, private ComponentLibrary: Higherframe.Drawing.Component.Library.IService) {

      // Add the select tool
      this.items.push({
        title: 'Select',
        icon: '/assets/images/select.svg',
        active: true
      });

      // Add the artboard tool
      this.items.push({
        title: 'Edit artboards',
        icon: '/assets/images/artboard.svg'
      });

      // Add the component tools
      this.ComponentLibrary.getItems().forEach((item) => {

        this.items.push({
          title: item.title,
          icon: item.icon
        });
      });
    }

    onItemClick(item) {

      this.items.forEach((item) => item.active = false);
      item.active = true;
    }
  }
}

angular
  .module('siteApp')
  .controller('ToolboxCtrl', Higherframe.Controllers.Frame.ToolboxTrayController);
