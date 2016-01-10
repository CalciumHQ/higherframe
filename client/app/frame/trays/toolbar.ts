/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  export class ToolbarController {

    quickAdd: string = '';
    components: Array<Higherframe.Drawing.Component.Library.ILibraryItem> = [];

    generateImageWorking: boolean = false;

    constructor(private $scope: ng.IScope, private $http: ng.IHttpService, private ComponentLibrary: Higherframe.Drawing.Component.Library.IService) {

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
