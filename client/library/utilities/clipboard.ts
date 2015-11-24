
module Higherframe.Utilities {

  export enum ClipboardItemType {
    Component
  };

  export class ClipboardItem {

    type: ClipboardItemType;
    id: String;
    data: any;

    constructor(type: ClipboardItemType, id: String, data: any) {

      this.type = type;
      this.id = id;
      this.data = data;
    }
  }

  export class Clipboard {

    constructor(private localStorageService) {}

    clear() {

      this.setItems([]);
    }

    add(item: ClipboardItem) {

      var items = this.getItems();
      items.push(item);

      this.setItems(items);
    }

    setItems(items:Array<ClipboardItem>) {

      this.localStorageService.set('clipboard', items);
    }

    getItems(): Array<ClipboardItem> {

      return <Array<ClipboardItem>>this.localStorageService.get('clipboard') || [];
    }
  }
}

angular
  .module('siteApp')
  .service('Clipboard', Higherframe.Utilities.Clipboard);
