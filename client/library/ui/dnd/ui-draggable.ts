
module Higherframe.UI {

  export class DraggableService {

    constructor(private $rootScope: ng.IRootScopeService, private $document: ng.IDocumentService) {

      let body = this.$document.find('body');

      body.on('mouseup', (event) => {

        this.$rootScope.$apply(() => { this.onMouseUp(event); });
      });

      body.on('mousemove', (event) => {

        this.$rootScope.$apply(() => { this.onMouseMove(event); });
      });
    }

    onMouseUp(event) {

      this.$rootScope.$broadcast('ui:draggable:mouseup', event);
    }

    onMouseMove(event) {

      this.$rootScope.$broadcast('ui:draggable:mousemove', event);
    }
  }

  export class DraggableDirective implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    restrict = 'A';

    constructor(
      private DraggableService: Higherframe.UI.DraggableService,
      private $document: ng.IDocumentService,
      private $parse: ng.IParseService
    ) {

      DraggableDirective.prototype.link = ($scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

        var isDragging: boolean;
        var anchor: { x: number, y: number};
        var relative: { x: number, y: number};

        (function() {

          initializeStyles();
          attachEventHandlers();
        })();

        function initializeStyles() {

          element.css('position', 'relative');
        }

        function attachEventHandlers() {

          element.bind('mousedown', (event) => {

            this.$scope.$apply(() => onMouseDown(event));
          });

          $scope.$on('ui:draggable:mouseup', onMouseUp);
          $scope.$on('ui:draggable:mousemove', onMouseMove);
        }

        function onMouseDown(event) {

          event.preventDefault();
          event.stopPropagation();
          start(event.clientX, event.clientY);
        }

        function onMouseUp(event, originalEvent) {

          if (isDragging) {

            end(originalEvent);
          }
        }

        function onMouseMove(event, originalEvent) {

          if (!isDragging) {

            return;
          }

          relative = {
            x: originalEvent.clientX - anchor.x,
            y: originalEvent.clientY - anchor.y
          };

          element
            .css('left', `${relative.x}px`)
            .css('top', `${relative.y}px`);
        }

        function start(x: number, y: number) {

          isDragging = true;
          anchor = { x:x, y:y }
          element.addClass('ui-draggable-dragging');
        }

        function end(event) {

          isDragging = false;
          anchor = null;
          relative = null;
          element.removeClass('ui-draggable-dragging');
          element
            .css('left', '0')
            .css('top', '0');

          // Call the provided handler
          var attrHandler = $parse(attrs['uiDraggableEnd']);
          attrHandler($scope, { $event: event });
        }
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = (DraggableService: Higherframe.UI.DraggableService, $document: ng.IDocumentService, $parse: ng.IParseService) => new DraggableDirective(DraggableService, $document, $parse);
      directive.$inject = ['DraggableService', '$document', '$parse'];
      return directive;
    }
  }
}

angular
  .module('siteApp')
  .service('DraggableService', Higherframe.UI.DraggableService)
  .directive('uiDraggable', Higherframe.UI.DraggableDirective.factory());
