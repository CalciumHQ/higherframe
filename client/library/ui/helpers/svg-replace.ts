
module Higherframe.UI {
  export class SVGReplaceDirective implements ng.IDirective {

    // Directive configuration
    link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    restrict = 'E';

    constructor(private $http: ng.IHttpService) {

      SVGReplaceDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

        scope.$watch(() => element.attr('src'), (src) => {

          this.doReplace(src, element);
        });
      };
    }

    static factory(): ng.IDirectiveFactory {

      const directive = ($http: ng.IHttpService) => new SVGReplaceDirective($http);
      directive.$inject = ['$http'];
      return directive;
    }

    doReplace(src: string, element: ng.IAugmentedJQuery) {

      if (!src) {

        return;
      }

      this.$http
        .get(src, { headers: {'Content-Type': 'application/xml'}})
        .success((data) => {

          element.replaceWith(this.manipulateImgNode(data, element));
        });
    }

    manipulateImgNode(data: any, element: ng.IAugmentedJQuery):HTMLElement {

      var $svg = angular.element(data)[0];
      var imgClass = element.attr('class');

      if (typeof(imgClass) !== 'undefined') {

        var classes = imgClass.split(' ');

        for (var i = 0; i < classes.length; ++i) {

          $svg.classList.add(classes[i]);
        }
      }

      $svg.removeAttribute('xmlns:a');

      return $svg;
    }
  }
}

angular
  .module('siteApp')
  .directive('svgReplace', Higherframe.UI.SVGReplaceDirective.factory());
