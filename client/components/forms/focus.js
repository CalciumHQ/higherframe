'use strict';

angular
  .module('siteApp')
  .directive('focusOn', function ($parse) {

    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {

        var model = $parse(attrs.focusOn);
        $scope.$watch(model, function (focus) {

          if (!!focus) {

            element.focus();
          }
        });

        // Set model to false when element blurred
        element.bind('blur', function() {

          $scope.$apply(model.assign($scope, false));
        });
      }
    };
  });
