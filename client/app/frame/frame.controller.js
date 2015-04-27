'use strict';

angular
  .module('siteApp')
  .controller('FrameCtrl', function ($scope, $filter) {

    $scope.quickAdd = '';
    $scope.components = [
      {
        name: 'Rectangle',
        tags: [
          'shape',
          'basic'
        ],
        draw: function (paper) {

          var rectangle = new Rectangle(new Point(100, 200), new Point(200, 300));
          var path = new Path.Rectangle(rectangle);
          path.strokeColor = '#888';
          path.fillColor = 'white';
        }
      },
      {
        name: 'Circle',
        tags: [
          'shape',
          'basic'
        ],
        draw: function (paper) {

          var center = new Point(100, 200);
          var path = new Path.Circle(center, 50);
          path.strokeColor = '#888';
          path.fillColor = 'white';
        }
      },
      {
        name: 'Triangle',
        tags: [
          'shape',
          'basic'
        ],
        draw: function (paper) {

          var center = new Point(100, 200);
          var path = new Path.RegularPolygon(center, 3, 50);
          path.strokeColor = '#888';
          path.fillColor = 'white';
        }
      }
    ];

    $scope.wireframe = {

    };

    $scope.onComponentClick = function (component) {

      component.draw();
    };

    $scope.onQuickAddKeyDown = function (event) {

      if (!$scope.quickAdd) {

        return;
      }

      if (event.keyCode == 13 || event.keyCode == 9) {

        var component = $filter('filter')($scope.components, $scope.quickAdd)[0];

        if (component) {

          component.draw();
          $scope.quickAdd = '';
        }

        event.preventDefault();
      }
    };
    
  });
