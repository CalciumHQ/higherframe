/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  export class ToolboxTrayController {

    components: Array<Higherframe.Drawing.Component.Library.ILibraryItem> = [];
    categories: Object = {};
    all: boolean = true;

    constructor(private $scope: ng.IScope, private ComponentLibrary: Higherframe.Drawing.Component.Library.IService) {

      this.components = this.ComponentLibrary.getItems();
      this.registerWatches();
      this.registerComponents();
    }

    private registerWatches() {

      this.$scope.$watch(() => this.categories, () => {

        let hasFilter = _.find(_.values(this.categories), (category: any) => {

          return category.active;
        });

        this.all = !hasFilter;
      }, true);
    }

    private registerComponents() {

      let categoryNames = _.uniq(this.components.map((component) => {

        return component.category;
      }));

      categoryNames.forEach((categoryName: string) => {

        this.categories[categoryName] = {
          name: categoryName,
          active: false
        };
      });
    };

    filterPredicate(component) {

      return (component) => {

        return this.all || this.categories[component.category].active;
      };
    }

    onAllCategoriesClick() {

      this.clearCategories();
      this.all = true;
    }

    onCategoryClick(category) {

      this.clearCategories()
      category.active = true;
      this.all = false;
    }

    private clearCategories() {

      angular.forEach(this.categories, (c) => {

        c.active = false;
      });
    }

    onComponentClick(component) {

    }

    onComponentDragEnd($event, component) {

      this.$scope.$emit('toolbox:component:added', {
        id: component.id,
        x: $event.offsetX,
        y: $event.offsetY
      });
    }
  }
}

angular
  .module('siteApp')
  .controller('ToolboxCtrl', Higherframe.Controllers.Frame.ToolboxTrayController);
