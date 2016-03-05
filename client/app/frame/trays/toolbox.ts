/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  interface ToolboxItem {
    tool?: Higherframe.Wireframe.Tool,
    title: string,
    icon: string,
    shortcut?: {
      code: number
    },
    active?: boolean
  }

  export class ToolboxTrayController {

    private items: Array<ToolboxItem> = [];

    constructor(
      private $scope: ng.IScope,
      private $rootScope: ng.IRootScopeService,
      private $timeout: ng.ITimeoutService,
      private ComponentLibrary: Higherframe.Drawing.Component.Library.IService
    ) {

      // Attach event handlers
      this.attachEventHandlers();

      // Add the select tool
      let select = {
        tool: new Wireframe.Tools.Select(),
        title: 'Select',
        icon: '/assets/images/select.svg',
        shortcut: {
          code: 118   // v
        }
      };

      this.items.push(select);

      // Add the artboard tool
      this.items.push({
        tool: new Wireframe.Tools.Artboard(),
        title: 'Edit artboards',
        icon: '/assets/images/artboard.svg',
        shortcut: {
          code: 111   // o
        }
      });

      // Add the component tools
      this.ComponentLibrary.getItems().forEach((item) => {

        this.items.push(item);
      });

      // Select the select tool, after allowing canvas to initialize
      this.$timeout(() => this.selectItem(select));

    }

    attachEventHandlers() {

      angular
        .element('body')
        .on('keypress', (event) => this.$scope.$apply(() => this.onKeyPress.call(this, event)));
    }

    onItemClick(item) {

      this.selectItem(item);
    }

    selectItem(item) {

      this.items.forEach((item) => item.active = false);
      item.active = true;

      this.$rootScope.$broadcast('toolbox:tool:selected', item.tool);
    }

    onKeyPress(event) {

      console.log(event.which);
  		this.items.forEach((item) => {

        if (item.shortcut && item.shortcut.code == event.which) {

          this.selectItem(item);
        }
      })
  	}
  }
}

angular
  .module('siteApp')
  .controller('ToolboxCtrl', Higherframe.Controllers.Frame.ToolboxTrayController);
