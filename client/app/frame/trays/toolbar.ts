/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  export class ToolbarController {

    quickAdd = {
      value: '',
      focus: false
    };

    components: Array<Higherframe.Drawing.Component.Library.ILibraryItem> = [];

    isFullscreen: boolean = false;
    generateImageWorking: boolean = false;

    constructor(private $scope: ng.IScope, private $http: ng.IHttpService, private ComponentLibrary: Higherframe.Drawing.Component.Library.IService) {

      this.components = this.ComponentLibrary.getItems();
      this.registerListeners();
    }

    private registerListeners() {

      // Reflect fullscreen state in toolbar button
      document.addEventListener('fullscreenchange', () => {

        this.$scope.$apply(() => this.isFullscreen = (<any>document).fullscreen);
      }, false);

      document.addEventListener('mozfullscreenchange', () => {

        this.$scope.$apply(() => this.isFullscreen = (<any>document).mozFullScreen);
      }, false);

      document.addEventListener('webkitfullscreenchange', () => {

        this.$scope.$apply(() => this.isFullscreen = (<any>document).webkitIsFullScreen);
      }, false);

      document.addEventListener('msfullscreenchange', () => {

        this.$scope.$apply(() => this.isFullscreen = (<any>document).msFullscreenElement);
      }, false);

      // Subscribe to view events
      this.$scope.$on('view:mousedown', () => {

        this.quickAdd.focus = false;
      });
    }

    onToolbarFullscreenClick() {

      if (!this.isFullscreen) {

        this.$scope.$emit('toolbar:view:gofullscreen');
      }

      else {

        this.$scope.$emit('toolbar:view:cancelfullscreen');
      }
  	}

    onQuickAddSelect($item: Higherframe.Drawing.Component.Library.ILibraryItem) {

      // Add the component
      this.$scope.$emit('toolbar:component:added', { id: $item.id });

      // Clear the quick add input
      this.quickAdd.value = '';
    }

    onGenerateImageClick(frame: Higherframe.Data.IFrame, type: string) {

      this.generateImageWorking = true;

      this.$http
        .get(`/api/frames/${ frame._id }/export?type=${ type }`)
        .success((response: any) => {

          this.generateImageWorking = false;

          var el = angular.element('<a />')
            .attr('href', response.image.original)
            .attr('download', `download.${ type }`)
            .get(0)

          el.click();
        })
        .error((error: any) => {

          console.log(error);
          this.generateImageWorking = false;
        });
    }
  }
}

angular
  .module('siteApp')
  .controller('ToolbarCtrl', Higherframe.Controllers.Frame.ToolbarController);
