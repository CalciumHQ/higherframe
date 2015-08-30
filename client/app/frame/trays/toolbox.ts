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
    categories: Array<String> = [];

    constructor(private $scope: ng.IScope) {

      this.registerComponents();
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
      this.registerComponent(Higherframe.Drawing.Component.Type.IPhone);
      this.registerComponent(Higherframe.Drawing.Component.Type.IPhoneTitlebar);

      this.categories = _.uniq(this.components.map((component) => {

        return component.category;
      }));
    };

    categoryComparitor(category) {

      return (component) => {

        return component.category == category;
      }
    }

    onComponentClick(component) {

      this.$scope.$emit('tray:component:added', component.id);
    }
  }

  export class ToolboxTray implements Higherframe.UI.ITray {

    label = 'Toolbox';
    templateUrl = '/app/frame/trays/toolbox.html';
    controller = ToolboxTrayController;
  }
}
