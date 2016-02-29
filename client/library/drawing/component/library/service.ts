
module Higherframe.Drawing.Component.Library {

  export interface IService {
    getItems(): Array<ILibraryItem>
  }

  export interface ILibraryItem {
    id: string,
    title: string,
    icon: string
  }

  export class ServiceProvider implements ng.IServiceProvider {

    private items: Array<ILibraryItem> = [];

    public register(item: ILibraryItem) {

      // Add to the list
      this.items.push(item);
    }

    public $get(): IService {

      return { getItems: () => this.items };
    }
  }
}

angular
  .module('siteApp')
  .provider('ComponentLibrary', Higherframe.Drawing.Component.Library.ServiceProvider)
