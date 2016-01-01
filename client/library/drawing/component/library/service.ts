
module Higherframe.Drawing.Component.Library {

  export interface IService {
    getItems(): Array<ILibraryItem>
  }

  export interface ILibraryItem {
    id: string,
    category: string,
    title: string,
    preview: string
  }

  export class ServiceProvider implements ng.IServiceProvider {

    private items: Array<ILibraryItem> = [];

    public registerComponent(type: Higherframe.Drawing.Component.Type) {

      // Get a string representation of the component type enum
      var id = Higherframe.Drawing.Component.Type[type];

      // Create a library item for the component
      var libraryItem: ILibraryItem = {
        id: id,
        category: Higherframe.Drawing.Component.Library[id].category,
        title: Higherframe.Drawing.Component.Library[id].title,
        preview: Higherframe.Drawing.Component.Library[id].preview
      };

      // Add to the list
      this.items.push(libraryItem);
    }

    public $get(): IService {

      return { getItems: () => this.items };
    }
  }
}

angular
  .module('siteApp')
  .provider('ComponentLibrary', Higherframe.Drawing.Component.Library.ServiceProvider)
