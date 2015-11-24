/// <reference path="../../../library/higherframe.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

module Higherframe.Controllers.Frame {

  export interface IToolboxTrayItem {
    id: String,
    category: String,
    title: String,
    preview: String
  }

  export class ToolboxTrayController {

    components: Array<IToolboxTrayItem> = [];
    categories: Object = {};
    all: boolean = true;

    constructor(private $scope: ng.IScope) {

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

    private registerComponent(type: Higherframe.Drawing.Component.Type) {

      var id = Higherframe.Drawing.Component.Type[type];

      var toolboxTrayItem = {
        id: id,
        category: Higherframe.Drawing.Component.Library[id].category,
        title: Higherframe.Drawing.Component.Library[id].title,
        preview: Higherframe.Drawing.Component.Library[id].preview
      };

      this.components.push(toolboxTrayItem);
    }

    private registerComponents() {

      this.registerComponent(Higherframe.Drawing.Component.Type.Rectangle);
      this.registerComponent(Higherframe.Drawing.Component.Type.Arrow);
      this.registerComponent(Higherframe.Drawing.Component.Type.Label);
      this.registerComponent(Higherframe.Drawing.Component.Type.Image);
      this.registerComponent(Higherframe.Drawing.Component.Type.IPhone);
      this.registerComponent(Higherframe.Drawing.Component.Type.IPhoneTitlebar);
      this.registerComponent(Higherframe.Drawing.Component.Type.TextInput);
      this.registerComponent(Higherframe.Drawing.Component.Type.SelectInput);
      this.registerComponent(Higherframe.Drawing.Component.Type.Checkbox);
      this.registerComponent(Higherframe.Drawing.Component.Type.Button);

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

  export class ToolboxTray implements Higherframe.UI.ITray {

    label = 'Toolbox';
    templateUrl = '/app/frame/trays/toolbox.html';
    controller = ToolboxTrayController;
  }
}

angular
  .module('siteApp')
  .controller('ToolboxController', Higherframe.Controllers.Frame.ToolboxTrayController);
