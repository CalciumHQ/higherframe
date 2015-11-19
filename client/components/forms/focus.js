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

            // Take outside of $digest loop
            setTimeout(function () {

              element.focus();
            }, 1);
          }

          else {

            // Take outside of $digest loop
            setTimeout(function () {

              element.blur();
            }, 1);
          }
        });

        // Set model to true when element focussed
        element.bind('focus', function() {

          if (model.assign) {

            $scope.$apply(model.assign($scope, true));
          }
        });

        // Set model to false when element blurred
        element.bind('blur', function() {

          if (model.assign) {

            $scope.$apply(model.assign($scope, false));
          }
        });
      }
    };
  });
