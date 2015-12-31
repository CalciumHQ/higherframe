
module Higherframe.UI {

  export class ScrollLockDirective implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    restrict = 'A';

    element: ng.IAugmentedJQuery;
    locked: boolean = true;

    constructor() {

      ScrollLockDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

        this.element = element;

        this.element.on('scroll mousedown wheel DOMMouseScroll mousewheel keyup', (event) => {

          // Only call handler if triggered by user (not programatically using `.scrollTop`)
          // See: http://stackoverflow.com/questions/2834667/how-can-i-differentiate-a-manual-scroll-via-mousewheel-scrollbar-from-a-javasc
          if (event.which > 0 || event.type == 'mousedown' || event.type == 'mousewheel') {

            scope.$apply(() => this.onScroll.call(this, event));
          }
        });

        this.updateLoop();
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = () => new ScrollLockDirective();
      directive.$inject = [];
      return directive;
    }

    onScroll(event) {

      if (event.originalEvent.deltaY < 0) {

        this.locked = false;
      }

      else if (this.element.scrollTop() + this.element[0].clientHeight >= this.element[0].scrollHeight) {

        this.locked = true;
      }

      else {

        this.locked = false;
      }
    }

    updateLoop() {

      this.update();

      requestAnimationFrame(() => {

        this.updateLoop();
      });
    }

    update() {

      if (this.locked) {

        this.element.scrollTop(10000000);
      }
    }
  }
}

angular
  .module('siteApp')
  .directive('scrollLock', Higherframe.UI.ScrollLockDirective.factory());
