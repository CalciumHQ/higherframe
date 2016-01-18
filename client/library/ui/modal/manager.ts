
module Higherframe.UI.Modal {

  export class Manager {

    stack: Array<IModal> = [];
    mask: ng.IAugmentedJQuery;

    constructor(
      private $rootScope: ng.IRootScopeService,
      private $document: ng.IDocumentService,
      private $compile: ng.ICompileService
    ) {

      $rootScope.$on('modal:pop', () => {

        this.pop();
      });

      $rootScope.$on('modal:close', (e, modal) => {

        this.remove(modal);
      });
    }

    present(modal: Higherframe.UI.Modal.IModal) {

      var scope = <any>this.$rootScope.$new();
      scope.ModalCtrl = modal;
      modal.$scope = scope;

      var html = '<div class="ui-modal-wrapper"><div ng-include="ModalCtrl.templateUrl" ng-keyup="ModalCtrl.onKeyUp($event)"></div></div>';
      var element = this.$compile(html)(modal.$scope);
      element.data('$ngControllerController', modal);
      element.children().data('$ngControllerController', modal);
      element.appendTo(this.$document.find('body')[0]);
      modal.element = element;

      if (!this.stack.length) {

        this.addMask();
      }

      this.stack.push(modal);
    }

    remove(modal: Higherframe.UI.Modal.IModal) {

      modal.remove();

      var index = this.indexOf(modal);
      this.stack.splice(index, 1);

      if (!this.stack.length) {

        this.removeMask();
      }
    }

    pop() {

      var modal = this.stack[this.stack.length-1];
      this.remove(modal);
    }

    indexOf(modal: Higherframe.UI.Modal.IModal) {

      return this.stack.indexOf(modal);
    }

    private addMask() {

      this.mask = angular.element('<div class="ui-modal-mask"></div>');
      this.mask.appendTo(this.$document.find('body')[0]);
    }

    private removeMask() {

      if (!this.mask) {

        return;
      }

      this.mask.remove();
      this.mask = null;
    }
  }
}

angular.module('siteApp').service('ModalManager', Higherframe.UI.Modal.Manager);
